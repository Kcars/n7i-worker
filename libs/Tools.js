const fs = require('fs');

const setting = require("../setting.json");
const stopwords = require("../stopword.json");
const channel = require("../Channel");

const axios = require('axios');

const { createClient } = require('redis');
const client = createClient();
const prefix = 'n7i';

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

const url_stat = "https://www.googleapis.com/youtube/v3/videos";
const part = "id,snippet,statistics,liveStreamingDetails";

const doAppendRecord = async (yyyy, mm, channelId, videoId, text) => {
    let path = `./stats/records-${yyyy}${mm}.ndjson`;

    await client.DEL(`${prefix}:live:${videoId}`);
    await client.DEL(`${prefix}:message_ids:${videoId}`);

    await client.SREM(`${prefix}:live:ids`, videoId);
    await client.SREM(`${prefix}:upcoming:ids`, videoId);

    await client.SADD(`${prefix}:old:ids`, videoId);

    fs.readFile(path, async (err, output) => {
        let content = output != null && output != "" ? output.toString("utf8") : "";
        let not_append = content.indexOf(`{"id":"${videoId}"`) == -1 || content == "";

        if (not_append) {
            fs.appendFile(path, text, async (err, res) => {
                let lang = channel.getLang(channelId);
                let content = `${videoId} ${yyyy} ${mm} ${lang}`;

                console.log(`[INFO][${yyyy}/${mm}][${videoId}] append to records. ${path}`);
                console.log(`[DEBUG] content: ${content}`);

                // 用bash script每分鐘處理
                await client.RPUSH(`${prefix}:record:queue`, content);
            });
        }
    });
}

const parseVideo = async (video) => {
    let channelId = video.snippet.channelId;

    let inChannelList = channel.getChannelIds().includes(channelId);

    // 只處理指定頻道下的影片
    if (inChannelList) {
        let videoStatus = video.snippet.liveBroadcastContent ? video.snippet.liveBroadcastContent : 'none'; // live , upcoming , none
        let videoId = video.id;
        let channelTitle = video.snippet.channelTitle;
        let title = video.snippet.title;
        let tags = video.snippet.tags != null ? video.snippet.tags.join(",") : "";
        let viewCount = video.statistics.viewCount != null ? video.statistics.viewCount : 0;
        let likeCount = video.statistics.likeCount != null ? video.statistics.likeCount : 0;
        let dislikeCount = 0; // 停用
        let favCount = 0; // 停用
        let commentCount = 0; // 停用
        let chatId = video.liveStreamingDetails != null && video.liveStreamingDetails.activeLiveChatId != null ? video.liveStreamingDetails.activeLiveChatId : "";
        let schTime = video.liveStreamingDetails != null && video.liveStreamingDetails.scheduledStartTime != null ? video.liveStreamingDetails.scheduledStartTime : 0;
        let startTime = video.liveStreamingDetails != null && video.liveStreamingDetails.actualStartTime != null ? video.liveStreamingDetails.actualStartTime : 0;
        let liveViewCount = video.liveStreamingDetails != null && video.liveStreamingDetails.concurrentViewers != null ? video.liveStreamingDetails.concurrentViewers : 0;

        let key = `${prefix}:live:${videoId}`;

        if (videoStatus == 'none') {
            let yyyy = new Date(startTime).getFullYear();
            let mm = new Date(startTime).getMonth() + 1;

            let item = await client.HGETALL(`${key}`);

            if (Object.keys(item).length > 0) {
                let item_str = `${JSON.stringify(item)}\r\n`;

                mm = mm < 10 ? `0${mm}` : mm;

                await doAppendRecord(yyyy, mm, channelId, videoId, item_str);
            } else {
                await client.SADD(`${prefix}:old:ids`, videoId);
                //console.log(`${key} is empty`);
            }
        } else {
            // 先全部移除
            await client.SREM(`${prefix}:live:ids`, videoId);
            await client.SREM(`${prefix}:upcoming:ids`, videoId);
            await client.SREM(`${prefix}:old:ids`, videoId);

            let playTime = '00:00:00';

            // 重新加入
            if (videoStatus == 'upcoming') {
                await client.SADD(`${prefix}:upcoming:ids`, videoId);
            }

            if (videoStatus == 'live') {
                await client.SADD(`${prefix}:live:ids`, videoId);

                let startTimeSec = videoStatus == 'live' ? new Date(startTime).getTime() : new Date().getTime();
                let playTimeSec = (new Date().getTime() - startTimeSec) / 1000;

                playTime = new Date(playTimeSec * 1000).toISOString().substring(11, 19)
            }

            // 更新資訊
            await client.HSET(`${key}`, 'status', videoStatus);
            await client.HSET(`${key}`, 'id', videoId);
            await client.HSET(`${key}`, 'channel_id', channelId);
            await client.HSET(`${key}`, 'channel_title', channelTitle);
            await client.HSET(`${key}`, 'title', title);
            await client.HSET(`${key}`, 'tags', tags);
            await client.HSET(`${key}`, 'view_count', viewCount);
            await client.HSET(`${key}`, 'like_count', likeCount);
            await client.HSET(`${key}`, 'dislike_count', dislikeCount);
            await client.HSET(`${key}`, 'fav_count', favCount);
            await client.HSET(`${key}`, 'comment_count', commentCount);
            await client.HSET(`${key}`, 'chat_id', chatId);
            await client.HSET(`${key}`, 'live_sch_time', schTime);
            await client.HSET(`${key}`, 'live_start_time', startTime);
            await client.HSET(`${key}`, 'live_view_count', liveViewCount);
            await client.HSET(`${key}`, 'play_time', playTime);

            await client.HINCRBY(`${key}`, 'new_sponsor', 0);
            await client.HINCRBY(`${key}`, 'amount_micros', 0);
            await client.HINCRBY(`${key}`, 'chat', 0);
            await client.HINCRBY(`${key}`, 'chat_total', 0);

            await client.HINCRBY(`${key}`, 'delay', 0);
        }
    } else {
        //console.log(`${channelId} not in channelList.`);
    }
}

const getVideoHashList = async (status) => {
    let output = [];
    let keys = await client.KEYS(`${prefix}:live:*`);

    for (const key of keys) {
        if (key != `${prefix}:live:ids`) {
            let item = await client.HGETALL(key);

            if (item.status != null && item.status != '' && item.status == status) {
                item.play_time = item.play_time == null ? '00:00:00' : item.play_time;
                output.push(item);
            }
        }
    }

    return output;
}

const setVideoHash = async (videoId, propName, val) => {
    let key = `${prefix}:live:${videoId}`;

    await client.HSET(`${key}`, propName, val);

    return true;
}

const incrVideoHash = async (videoId, propName, val) => {
    let key = `${prefix}:live:${videoId}`;

    await client.HINCRBY(`${key}`, propName, val);

    return true;
}

/**
 * 產生目前的直播資訊資訊物件
 */
const getVideoJson = async () => {
    let dd = new Date();

    let timestamp = dd.toISOString();
    let timestamp_num = dd.getTime();

    let upcoming = await getVideoHashList('upcoming');
    let live = await getVideoHashList('live');

    let output = {
        timestamp
        , timestamp_num
        , upcoming
        , live
    }

    return output;
}

/**
 * 將目前的直播資訊寫成檔案
 */
const writeVideoJson = async () => {
    let path = 'stats/video.json';
    let json = await getVideoJson();
    let json_str = JSON.stringify(json);

    fs.writeFile(path, json_str, (err, res) => {

    });
}

/**
 * 將SC的單位轉成日幣
 * @param {Number} amount_micros 
 * @param {String} currency 
 * @returns 
 */
const getRealAmount = (amount_micros, currency) => {
    switch (currency) {
        case "GBP": // 1GBP=?JPY
            amount_micros = amount_micros * 139;
            break;
        case "PEN": // 1PEN=?JPY
            amount_micros = amount_micros * 32.43;
            break;
        case "TWD": // 1TWD=?JPY
            amount_micros = amount_micros * 3.5;
            break;
        case "USD": // 1USD=?JPY
            amount_micros = amount_micros * 108;
            break;
        case "EUR": // 1EUR=?JPY
            amount_micros = amount_micros * 120;
            break;
        case "KRW": // 1KRW=?JPY
            amount_micros = amount_micros * 0.09;
            break;
        case "SEK": // 1SEK=?JPY
            amount_micros = amount_micros * 11.22;
            break;
        case "AUD": // 1AUD=?JPY
            amount_micros = amount_micros * 74.14;
            break;
        case "CAD": // 1CAD=?JPY
            amount_micros = amount_micros * 83.21;
            break;
        case "BRL": // 1BRL=?JPY
            amount_micros = amount_micros * 27.15;
            break;
        case "MXN": // 1MXN=?JPY
            amount_micros = amount_micros * 5.7;
            break;
        case "HKD": // 1HKD=?JPY
            amount_micros = amount_micros * 13.86;
            break;
        case "RUB": // 1RUB=?JPY
            amount_micros = amount_micros * 1.71;
            break;
        case "PHP": // 1PHP=?JPY
            amount_micros = amount_micros * 2.13;
            break;
        case "INR": // 1INR=?JPY
            amount_micros = amount_micros * 1.53;
            break;
        case "SGD":
            amount_micros = amount_micros * 77.9;
            break;
    }

    amount_micros = parseInt(amount_micros / 1000000, 10);

    return amount_micros;
}

/**
 * 解析聊天訊息並整理出需要的物件
 * @param {Object} video 
 * @param {Object} item 
 * @returns 
 */
const parseLiveChatMessage = async (video, item) => {
    return new Promise(async (resolve, reject) => {
        let path = `chats/${video.id}.ndjson`;
        let mkey = `${prefix}:message_ids:${video.id}`; // 其實不必要

        let isAdd = await client.SISMEMBER(mkey, item.id);

        if (!isAdd) {
            let type = item.snippet.type;

            let startTimeSec = new Date(video.live_start_time).getTime();
            let playTimeSec = (new Date(item.snippet.publishedAt).getTime() - startTimeSec) / 1000;
            let playTime = new Date(playTimeSec * 1000).toISOString().substring(11, 19);

            let content = "";
            let amount = "￥0";
            let amount_micros = 0;
            let currency = "none";

            let is_new_sponsor = type == "newSponsorEvent";

            if (playTimeSec <= 0 || video.live_start_time == 0) {
                playTime = '00:00:00';
            }

            amount = item.snippet.superChatDetails != null ? item.snippet.superChatDetails.amountDisplayString : amount;
            amount_micros = item.snippet.superChatDetails != null ? item.snippet.superChatDetails.amountMicros : amount_micros;
            currency = item.snippet.superChatDetails != null ? item.snippet.superChatDetails.currency : currency;

            amount = item.snippet.superStickerDetails != null ? item.snippet.superStickerDetails.amountDisplayString : amount;
            amount_micros = item.snippet.superStickerDetails != null ? item.snippet.superStickerDetails.amountMicros : amount_micros;
            currency = item.snippet.superStickerDetails != null ? item.snippet.superStickerDetails.currency : currency;

            content = type == "newSponsorEvent" ? item.snippet.displayMessage : content;
            content = type == "textMessageEvent" ? item.snippet.textMessageDetails.messageText : content;
            content = type == "superChatEvent" ? item.snippet.superChatDetails.userComment : content;
            content = type == "superStickerEvent" ? item.snippet.superStickerDetails.superStickerMetadata.altText : content;

            /*if (!['newSponsorEvent', 'textMessageEvent', 'superChatEvent', 'superStickerEvent'].includes(item.snippet.type)) {
                let log_str = JSON.stringify(item);

                fs.appendFile('./livechat.log', `${log_str}\r\n`, (err, res) => {

                });
            }*/

            amount_micros = getRealAmount(amount_micros, currency); // 匯率一直沒有更新

            await client.SADD(mkey, item.id);

            let output = {
                channel_id: video.channel_id,
                video_id: video.id,
                chat_id: video.chat_id,
                user_id: item.authorDetails.channelId,
                user_name: item.authorDetails.displayName,
                is_verified: item.authorDetails.isVerified,
                is_owner: item.authorDetails.isChatOwner,
                is_sponsor: item.authorDetails.isChatSponsor,
                is_moderator: item.authorDetails.isChatModerator,
                message_id: item.id,
                post_time: item.snippet.publishedAt,

                content,
                amount,
                amount_micros,

                currency: item.snippet.superChatDetails != null ? item.snippet.superChatDetails.currency : currency,
                play_time: playTime,
                view_count: video.view_count,
                live_view_count: video.live_view_count,
                like_count: video.like_count,
                dislike_count: 0,
                fav_count: 0,
                comment_count: 0,
                is_new_sponsor,
            };

            let output_str = JSON.stringify(output);

            let inChannelList = channel.getChannelIds().includes(output.user_id);

            fs.appendFile(path, `${output_str}\r\n`, (err, res) => {

            });

            if (inChannelList) { // 如果是在頻道清單內的人
                let url_icon = item.authorDetails.profileImageUrl;
                let json = {
                    url_icon,
                    content: output.content,
                    video_id: output.video_id,
                    play_time: output.play_time,
                    from_channel_id: output.user_id,
                    from_channel_name: output.user_name,
                    to_channel_id: video.channel_id,
                    to_channel_name: video.channel_title,
                    amount_micros: output.amount_micros
                }

                let hasStopFirstword = stopwords.startWords.some((val) => {
                    return output.content.indexOf(val) == 0
                })

                let hasStopKeyword = stopwords.keywords.some((val) => {
                    return output.content.indexOf(val) != -1
                })

                if (hasStopFirstword || hasStopKeyword) {
                    console.log('include stopwords. skip it.');
                } else {
                    doSendLiveChatCard(json);
                }

                let yyyy = new Date().getFullYear();
                let mm = new Date().getMonth() + 1;

                mm = mm < 10 ? `0${mm}` : mm;

                let liver_message_path = `chats/liver-${yyyy}${mm}.ndjson`;
                fs.appendFile(liver_message_path, `${output_str}\r\n`, (err, res) => {

                });
            }

            if (type == 'membershipGiftingEvent') {
                let output = {};

                let yyyy = new Date().getFullYear();
                let mm = new Date().getMonth() + 1;

                mm = mm < 10 ? `0${mm}` : mm;
                
                try {
                    output = {
                        to_channel_id: video.channel_id,
                        to_channel_name: video.channel_title,
                        from_channel_id: item.authorDetails.channelId,
                        from_channel_name: item.authorDetails.displayName,
                        video_id: video.id,
                        video_name: video.title,
                        gift_count: item.snippet.membershipGiftingDetails.giftMembershipsCount,
                        gift_level: item.snippet.membershipGiftingDetails.giftMembershipsLevelName,
                        post_time: item.snippet.publishedAt,
                        play_time: playTime,
                    };
                } catch (err) {
                    console.log('gifting output json failed.');
                }

                let output_str = JSON.stringify(output);

                fs.appendFile(`./gifting-${yyyy}${mm}.log`, `${output_str}\r\n`, (err, res) => {

                });

                doSendGiftingMessage(output);
            }

            resolve({ is_new_sponsor, amount_micros });
        }
    })
}

/**
 * 轉送贈送聊天訊息
 * @param {Object} json 
 */
const doSendLiveChatCard = (json) => {
    console.log(`post 127.0.0.1:3456: `);
    console.log(JSON.stringify(json));
    axios.post('http://127.0.0.1:3456', json).catch((err) => {
        console.log('doSendLiveChatCard failed')
    });
}

/**
 * 轉送贈送會員資訊
 * @param {Object} json 
 */
const doSendGiftingMessage = (json) => {
    axios.post('http://127.0.0.1:3456/gifting', json).catch((err) => {
        console.log('doSendGiftingMessage failed')
    });
}

/**
 * 取得指定頻道編號的頻道資訊
 * @param {String} id 
 * @returns 
 */
const getChannelInfoList = (id) => {
    return new Promise((resolve, reject) => {
        let url_stat = "https://www.googleapis.com/youtube/v3/channels";
        let key = setting.youtube.key;
        let part = "id,snippet,statistics";

        let items = [];

        axios(url_stat, { params: { key, part, id } }).then(async (res) => {
            try {
                items = res.data.items;
            } catch (err) {

            }
            resolve(items);
        }).catch(() => {
            resolve(items);
        });
    })
}

/**
 * 取得指定影片的聊天室訊息
 * @param {Object} video 
 * @returns 
 */
const getLiveChat = (video) => {
    return new Promise((resolve, reject) => {
        let url_chat = "https://www.googleapis.com/youtube/v3/liveChat/messages";
        let key = setting.youtube.key;
        let part = "id,snippet,authorDetails";
        let maxResults = 1900;

        let liveChatId = video.chat_id;
        let pageToken = video.token == '' || video.token == 'helpme' ? null : video.token;

        axios(url_chat, { params: { key, part, liveChatId, maxResults, pageToken } }).then(async (res) => {
            let info = res.data;
            let pollingIntervalMillis = info.pollingIntervalMillis;
            let nextPageToken = info.nextPageToken;
            let items = info.items;
            let itemCount = items.length;
            let pageInfo = info.pageInfo;

            let totalNewSponsor = 0;
            let totalAmountMicros = 0;

            for (item of items) {
                let messageInfo = await parseLiveChatMessage(video, item);
                totalNewSponsor = messageInfo.is_new_sponsor ? totalNewSponsor + 1 : totalNewSponsor;
                totalAmountMicros = totalAmountMicros + messageInfo.amount_micros;
            }

            if (itemCount > 0) {
                await setVideoHash(video.id, 'chat', itemCount); // 應該要拔掉
                await incrVideoHash(video.id, 'chat_total', itemCount);
            }

            if (totalNewSponsor > 0) {
                await incrVideoHash(video.id, 'new_sponsor', totalNewSponsor);
            }

            if (totalAmountMicros > 0) {
                await incrVideoHash(video.id, 'amount_micros', totalAmountMicros);
            }

            let output = {
                result: true,
                pollingIntervalMillis,
                nextPageToken,
                itemCount,
                totalNewSponsor,
                totalAmountMicros,
                pageInfo
            };

            resolve(output);
        }).catch((err) => {
            // sample
            // {"error":{"code":403,"message":"The live chat is no longer live.","errors":[{"message":"The live chat is no longer live.","domain":"youtube.liveChat","reason":"liveChatEnded"}]}}
            let errReason = '';

            try {
                errReason = err.response.data.error.errors[0].reason;
            } catch (e) {
                reject(-1);
            }

            // 在doAppendRecord一併處理 偶爾會重複出錯也無所謂

            //client.SREM(`${prefix}:live:ids`, video.id);
            //client.SREM(`${prefix}:upcoming:ids`, video.id);

            //client.DEL(`${prefix}:live:${video.id}`);
            //client.DEL(`${prefix}:message_ids:${video.id}`);

            resolve({ result: false, errReason })
        });
    })
}

/**
 * 將傳入陣列分割成指定最大數量的陣列集合
 * @param {Array} arr 
 * @param {Int} size 
 * @returns [ [] , [] ... ]
 */
exports.getChunkArray = (arr, size = 40) => {
    let index = 0;
    let arrLen = arr.length;
    let output = [];

    for (index = 0; index < arrLen; index += size) {
        let subArr = arr.slice(index, index + size);
        output.push(subArr);
    }

    return output;
}

/**
 * 取得直播待播的影片編號
 * @returns Array
 */
exports.getCurrentNotRecordVideoIds = async () => {
    let liveIds = await client.SMEMBERS(`${prefix}:live:ids`);
    let upcomingIds = await client.SMEMBERS(`${prefix}:upcoming:ids`);
    let output = [].concat(liveIds, upcomingIds);

    return output;
}

/**
 * 過濾掉非直播待播的影片編號
 * @param {Array} videoIds 
 * @returns 
 */
exports.getNotRecordVideoIds = (videoIds) => {
    return new Promise(async (resolve) => {
        let output = [];
        let recordIds = await client.SMEMBERS(`${prefix}:old:ids`);

        for (videoId of videoIds) {
            let isRecord = recordIds.includes(videoId);

            if (!isRecord) {
                output.push(videoId);
            }
        }

        resolve(output);
    })
}

/**
 * 取得指定影片編號的資訊
 * @param {Array} videoIds [videoid1, videoid2 ...]
 * @returns 
 */
exports.parseVideoByIds = async (videoIds) => {
    return new Promise(async (resolve, reject) => {
        let key = setting.youtube.key;
        let id = videoIds.join(",");

        if (videoIds.length > 0) {
            axios(url_stat, { params: { key, part, id } }).then(async (res) => {
                let videos = res.data.items;

                for (video of videos) {
                    try {
                        await parseVideo(video);
                    } catch (err) {
                        reject(-1);
                    }
                }

                // 回傳資料有漏=有影片取得不到資訊=移除它
                // 有可能是先暫時轉私人
                if (videos.length != videoIds.length) {
                    let backVideoIds = videos.map((video) => video.id);

                    for (videoId of videoIds) {
                        let inBackList = backVideoIds.includes(videoId);

                        if (!inBackList && videoId != null && videoId != '') {
                            console.log(`[WARN] ${videoId} can not get info.`);

                            await client.SREM(`${prefix}:live:ids`, videoId);
                            await client.SREM(`${prefix}:upcoming:ids`, videoId);

                            await client.DEL(`${prefix}:live:${videoId}`);
                            await client.DEL(`${prefix}:message_ids:${videoId}`);
                        }
                    }
                }

                resolve(0);
            }).catch((err) => {
                reject(-2);
            })
        }
    })
}

exports.getVideoHashList = getVideoHashList;
exports.getVideoJson = getVideoJson;
exports.writeVideoJson = writeVideoJson;

exports.setVideoHash = setVideoHash;
exports.incrVideoHash = incrVideoHash;

exports.getLiveChat = getLiveChat;

exports.getChannelInfoList = getChannelInfoList;