const fs = require('fs');

const setting = require("../setting.json");
const channel = require("../Channel");

const axios = require('axios');

const { createClient } = require('redis');
const client = createClient();
const prefix = 'n7i';

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

const url_stat = "https://www.googleapis.com/youtube/v3/videos";
const part = "id,snippet,statistics,liveStreamingDetails";

const doAppendRecord = (yyyy, mm, videoId, text) => {
    let path = `./stats/records-${yyyy}${mm < 10 ? `0${mm}` : mm}.ndjson`;

    client.DEL(`${prefix}:live:${videoId}`);
    client.DEL(`${prefix}:message_ids:${videoId}`);

    client.SREM(`${prefix}:live:ids`, videoId);
    client.SREM(`${prefix}:upcoming:ids`, videoId);

    client.SADD(`${prefix}:old:ids`, videoId);

    fs.readFile(path, (err, output) => {
        let content = output != null && output != "" ? output.toString("utf8") : "";
        let not_append = content.indexOf(`{"id":"${videoId}"`) == -1 || content == "";

        if (not_append) {
            fs.appendFile(path, text, (err, res) => {
                console.log(`[INFO][${yyyy}/${mm}][${videoId}] append to records. ${path}`);
                client.RPUSH(`${prefix}:record:queue`, `${videoId} ${yyyy} ${mm}`);
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
                doAppendRecord(yyyy, mm, videoId, item_str);
            } else {
                //console.log(`${key} is empty`);
            }
        } else {
            let isLive = false;

            // 先全部移除
            await client.SREM(`${prefix}:live:ids`, videoId);
            await client.SREM(`${prefix}:upcoming:ids`, videoId);
            await client.SREM(`${prefix}:old:ids`, videoId);

            // 重新加入
            if (videoStatus == 'upcoming') {
                await client.SADD(`${prefix}:upcoming:ids`, videoId);
            }

            if (videoStatus == 'live') {
                await client.SADD(`${prefix}:live:ids`, videoId);
                isLive = true
            }

            let startTimeSec = isLive ? new Date(startTime).getTime() : new Date().getTime();
            let playTimeSec = (new Date().getTime() - startTimeSec) / 1000;
            let playTime = isLive ? new Date(playTimeSec * 1000).toISOString().substring(11, 19) : '00:00:00';

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

const writeVideoJson = async () => {
    let path = 'stats/video.json';
    let json = await getVideoJson();
    let json_str = JSON.stringify(json);

    fs.writeFile(path, json_str, (err, res) => {

    });
}

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

const parseLiveChatMessage = async (video, item) => {
    return new Promise(async (resolve, reject) => {
        let path = `chats/${video.id}.ndjson`;
        let mkey = `${prefix}:message_ids:${video.id}`;

        let isAdd = await client.SISMEMBER(mkey, item.id);

        if (!isAdd) {
            let startTimeSec = new Date(video.live_start_time).getTime();
            let playTimeSec = (new Date(item.snippet.publishedAt).getTime() - startTimeSec) / 1000;
            let playTime = new Date(playTimeSec * 1000).toISOString().substring(11, 19);

            let content = "";
            let amount = "￥0";
            let amount_micros = 0;
            let currency = "none";

            let is_new_sponsor = item.snippet.type == "newSponsorEvent";

            amount = item.snippet.superChatDetails != null ? item.snippet.superChatDetails.amountDisplayString : amount;
            amount_micros = item.snippet.superChatDetails != null ? item.snippet.superChatDetails.amountMicros : amount_micros;
            currency = item.snippet.superChatDetails != null ? item.snippet.superChatDetails.currency : currency;

            amount = item.snippet.superStickerDetails != null ? item.snippet.superStickerDetails.amountDisplayString : amount;
            amount_micros = item.snippet.superStickerDetails != null ? item.snippet.superStickerDetails.amountMicros : amount_micros;
            currency = item.snippet.superStickerDetails != null ? item.snippet.superStickerDetails.currency : currency;

            content = item.snippet.type == "newSponsorEvent" ? item.snippet.displayMessage : content;
            content = item.snippet.type == "textMessageEvent" ? item.snippet.textMessageDetails.messageText : content;
            content = item.snippet.type == "superChatEvent" ? item.snippet.superChatDetails.userComment : content;
            content = item.snippet.type == "superStickerEvent" ? item.snippet.superStickerDetails.superStickerMetadata.altText : content;

            amount_micros = getRealAmount(amount_micros, currency); // 匯率一直沒有更新

            await client.SADD(mkey, item.id);

            let output = {
                channel_id: video.channel_id,
                video_id: video.id,
                chat_id: video.chat_id,
                user_id: item.snippet.authorChannelId,
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
                let user_icon = item.authorDetails.profileImageUrl;
                let json = {
                    user_icon,
                    content: output.content,
                    video_id: output.video_id,
                    play_time: output.play_time,
                    from_channel_id: output.user_id,
                    from_channel_name: output.user_name,
                    to_channel_id: video.channel_id,
                    to_channel_name: video.channel_title,
                    amount_micros: output.amount_micros
                }

                console.log(json);

                // doSendLiveChatCard(json)
            }

            resolve({ is_new_sponsor, amount_micros });
        }
    })
}

const doSendLiveChatCard = (json) => {
    console.log(`post 127.0.0.1:3456: `);
    console.log(json);
    axios.post('http://127.0.0.1:3456', json);
}

const getChannelInfoList = (id) => { // id= id1,id2,id3 ...
    console.log('getChannelInfoList')
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

            client.SREM(`${prefix}:live:ids`, video.id);
            client.SREM(`${prefix}:upcoming:ids`, video.id);

            client.DEL(`${prefix}:live:${video.id}`);
            client.DEL(`${prefix}:message_ids:${video.id}`);

            resolve({ result: false, errReason })
        });
    })
}

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

exports.getCurrentNotRecordVideoIds = async () => {
    let liveIds = await client.SMEMBERS(`${prefix}:live:ids`);
    let upcomingIds = await client.SMEMBERS(`${prefix}:upcoming:ids`);
    let output = [].concat(liveIds, upcomingIds);

    return output;
}

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
                // 有可能是先暫時轉私人 所以不要放到old裡
                if (videos.length != videoIds.length) {
                    let backVideoIds = videos.map((video) => video.id);

                    for (videoId of videoIds) {
                        let inBackList = backVideoIds.includes(videoId);

                        if (!inBackList && videoId != null && videoId != '') {
                            await client.SREM(`${prefix}:live:ids`, videoId);
                            await client.SREM(`${prefix}:upcoming:ids`, videoId);
                        }
                    }
                }

                resolve(0);
            }).catch((err) => {
                reject(-2);
            })
        }

        // debug
        /*
            let liveIds = await client.SMEMBERS(`${prefix}:live:ids`);
            let upcomingIds = await client.SMEMBERS(`${prefix}:upcoming:ids`);
            let oldIds = await client.SMEMBERS(`${prefix}:old:ids`);
            
            let liveKeys = await client.KEYS(`${prefix}:live:*`) ;
        
            console.log(`live: ${liveIds.join(" , ")}`);
            console.log(`upcoming: ${upcomingIds.join(" , ")}`);
            console.log(`old: ${oldIds.join(" , ")}`);
        
            console.log(`live:\r\n${liveKeys.join("\r\n")}`);
        */
    })
}

exports.getVideoHashList = getVideoHashList;
exports.getVideoJson = getVideoJson;
exports.writeVideoJson = writeVideoJson;

exports.setVideoHash = setVideoHash;
exports.incrVideoHash = incrVideoHash;

exports.getLiveChat = getLiveChat;

exports.getChannelInfoList = getChannelInfoList;