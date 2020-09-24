const redis = require("redis");
const redis_client = redis.createClient({ host: "127.0.0.1", port: 6379 });

const config = require("./config.json");

const KEY_YOUTUBE_LIVE_IDS = "youtube_live_ids";
const KEY_YOUTUBE_UPCOMING_IDS = "youtube_upcoming_ids";

const rq = require("request");

///

const async = require("async");

////

const fs = require("fs");

////

function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    let hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "00:";
    let mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "00:";
    let sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";

    return hDisplay + mDisplay + sDisplay;
}

function getRealAmount(amount_micros, currency) {
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
    }

    amount_micros = parseInt(amount_micros / 1000000, 10);

    return amount_micros;
}

function doParseMessage(video_id, channel_id, chat_id, message, start_time_num, view_count, live_view_count, like_count, dislike_count, fav_count, comment_count, index, len, polling_ms, results, pages, sec) {
    let user_id = message.snippet.authorChannelId;
    let user_name = message.authorDetails.displayName;
    let is_verified = message.authorDetails.isVerified;
    let is_owner = message.authorDetails.isChatOwner;
    let is_sponsor = message.authorDetails.isChatSponsor;
    let is_moderator = message.authorDetails.isChatModerator;

    let message_id = message.id;
    let post_time = message.snippet.publishedAt;
    let content = "";
    let is_before = start_time_num == 0;
    let play_time = is_before ? "00:00:00" : secondsToHms((new Date(post_time).getTime() - start_time_num) / 1000);

    let is_new_sponsor = message.snippet.type == "newSponsorEvent";

    let amount = "￥0";
    let amount_micros = 0;
    let currency = "none";

    amount = message.snippet.superChatDetails != null ? message.snippet.superChatDetails.amountDisplayString : amount;
    amount_micros = message.snippet.superChatDetails != null ? message.snippet.superChatDetails.amountMicros : amount_micros;
    currency = message.snippet.superChatDetails != null ? message.snippet.superChatDetails.currency : currency;

    amount = message.snippet.superStickerDetails != null ? message.snippet.superStickerDetails.amountDisplayString : amount;
    amount_micros = message.snippet.superStickerDetails != null ? message.snippet.superStickerDetails.amountMicros : amount_micros;
    currency = message.snippet.superStickerDetails != null ? message.snippet.superStickerDetails.currency : currency;

    content = message.snippet.type == "newSponsorEvent" ? message.snippet.displayMessage : content;
    content = message.snippet.type == "textMessageEvent" ? message.snippet.textMessageDetails.messageText : content;
    content = message.snippet.type == "superChatEvent" ? message.snippet.superChatDetails.userComment : content;
    content = message.snippet.type == "superStickerEvent" ? message.snippet.superStickerDetails.superStickerMetadata.altText : content;

    amount_micros = getRealAmount(amount_micros, currency);

    let output = {
        channel_id
        , video_id
        , chat_id
        , user_id
        , user_name
        , is_verified
        , is_owner
        , is_sponsor
        , is_moderator
        , message_id
        , post_time
        , content
        , amount
        , amount_micros
        , currency
        , play_time
        , view_count
        , live_view_count
        , like_count
        , dislike_count
        , fav_count
        , comment_count
        , is_new_sponsor
    };

    let path_append = `./chats/${video_id}.ndjson`;
    let output_str = JSON.stringify(output);

    let key_message_ids = `youtube_message_ids:${video_id}`;
    let key_live_id = `youtube_live:${video_id}`;

    redis_client.sismember(key_message_ids, message_id, (err, res) => {
        if (res != 1) {
            redis_client.sadd(key_message_ids, message_id, (err, res) => {
                fs.appendFile(path_append, `${output_str}\r\n`, (err, res) => {

                });

                redis_client.sadd(key_message_ids, message_id);

                redis_client.hset(key_live_id, "play_time", play_time);
                redis_client.hset(key_live_id, "chat", len, (err, res) => {

                });

                if (is_new_sponsor) { // todo: new member message maybe appear again? or cancel then add member?
                    redis_client.hincrby(key_live_id, "new_sponsor", 1, (err, res) => {

                    });
                }

                if (amount_micros > 0) {
                    redis_client.hincrby(key_live_id, "amount_micros", amount_micros, (err, res) => {
                        if (err) {
                            console.log(`amount_micros err: ${amount_micros}`);
                            console.log(err);
                        } else {
                        }
                    });
                }

                if (index == len) {
                    console.log(`[${video_id}][${sec}s][${live_view_count}p/${len}c] ${user_name} : ${content}`);
                }

                redis_client.sadd("youtube_currency", currency);

                if (config.user_list.indexOf(user_id) != -1) { // chat user is mod

                }
            });
        } else {
            count_exist++;
        }
    })
}

function getVideoInfoFromRedis(video_id) {
    return new Promise((resolve, reject) => {
        redis_client.hgetall(`youtube_live:${video_id}`, (err, item) => {
            if (item != null) {
                resolve(item);
            } else {
                console.log(`[ERROR] getVideoInfoFromRedis:${video_id} is empty.`);
                redis_client.srem(KEY_YOUTUBE_LIVE_IDS, video_id);
                redis_client.srem(KEY_YOUTUBE_UPCOMING_IDS, video_id);
            }
        });
    });
}

function getChatsByLiveChatId(liveChatId, pageToken) {
    return new Promise((resolve, reject) => {
        let url_chat = "https://www.googleapis.com/youtube/v3/liveChat/messages";
        let key = config.key;
        let part = "id,snippet,authorDetails";
        let maxResults = 1900;

        let qs = { key, part, liveChatId, maxResults, pageToken };
        let options = { qs };

        rq(url_chat, options, (err, res) => {
            let info = null;

            try {
                info = JSON.parse(res.body);
            } catch (err) {
                console.log(`[ERROR] getChatsByLiveChatId parse JSON failed.`);
            }

            if (info != null) {
                let token = info.nextPageToken;
                let list = info.items;
                let polling_ms = info.pollingIntervalMillis;
                let results = 0;
                let pages = 0;

                try {
                    results = info.pageInfo.totalResults;
                    pages = info.pageInfo.resultsPerPage;
                } catch (err) {
                    console.log(`[ERROR] getChatsByLiveChatId parse page info failed.`);
                }

                if (info.error != null) {
                    let error_info = info.error.errors[0];

                    resolve({ list: null, error_info });
                } else {
                    resolve({ list, token, polling_ms, results, pages });
                }
            } else {
                console.log(`[ERROR] not JSON format.`);
            }
        })
    });
}

function run(sec, video_type) {
    let key = video_type == "live" ? KEY_YOUTUBE_LIVE_IDS : KEY_YOUTUBE_UPCOMING_IDS;

    redis_client.smembers(key, (err, list) => {
        if (video_type == "upcoming") {
            console.log(`[DEBUG] upcoming video count: ${list.length}`);
        }

        async.eachSeries(list, (video_id, next) => {
            setTimeout(async () => {
                getVideoInfoFromRedis(video_id).then((item) => {
                    let channel_id = item.channel_id;
                    let view_count = item.view_count;
                    let like_count = item.like_count;
                    let dislike_count = item.dislike_count;
                    let fav_count = item.fav_count;
                    let comment_count = item.comment_count;
                    let liveChatId = item.chat_id;
                    let live_view_count = item.live_view_count;
                    let message_count = item.chat;
                    let start_time = item.start_time;
                    let start_time_num = start_time != 0 ? new Date(start_time).getTime() : 0;
                    let pageToken = item.token != null ? item.token : null;
                    let sch_time = item.sch_time;
                    let sch_time_num = new Date(sch_time).getTime();
                    let now_time_num = new Date().getTime();

                    let is_closing = sch_time_num - now_time_num < 60000; 
                    let is_pass = sec == 0;

                    if (video_type == "live") {
                        is_pass = live_view_count >= 10000 && sec % 10 == 0 ? true : is_pass; // online > 10000 then every 10s pass
                        is_pass = message_count > 50 && sec % 10 == 0 ? true : is_pass; // past count > 50 then every 10s pass

                        is_pass = start_time_num != 0 ? is_pass : false; // if streaming start then pass
                    } else {
                        is_pass = is_closing; 
                    }

                    is_pass = liveChatId != null && liveChatId != "" ? is_pass : false; 

                    if (is_pass) {
                        getChatsByLiveChatId(liveChatId, pageToken).then((info_chat) => {
                            if (info_chat.list != null) {
                                let key_live_id = `youtube_live:${video_id}`;

                                let list = info_chat.list;
                                let token = info_chat.token;
                                let polling_ms = info_chat.polling_ms;
                                let results = info_chat.results;
                                let pages = info_chat.pages;

                                let ii = 1;

                                list.forEach((message) => {
                                    try {
                                        doParseMessage(video_id, channel_id, liveChatId, message, start_time_num, view_count, live_view_count, like_count, dislike_count, fav_count, comment_count, ii, list.length, polling_ms, results, pages, sec);
                                        ii++;
                                    } catch (err) {
                                        console.log(message);
                                    }
                                });

                                redis_client.hset(key_live_id, "token", token);
                                redis_client.hincrby(key_live_id, "chat_total", list.length, (err, res) => {

                                });
                            } else {
                                console.log(`[WARN][${video_id}] youtube data api error. domain: ${info_chat.error_info.domain} , reason: ${info_chat.error_info.reason}`);
                                redis_client.srem(KEY_YOUTUBE_LIVE_IDS, video_id);
                                redis_client.srem(KEY_YOUTUBE_UPCOMING_IDS, video_id);
                            }

                            next();
                        });
                    } else {
                        next();
                    }
                });
            }, 500);
        })
    });
}

function everySeconds() {
    let mint = new Date().getMinutes();
    let sec = new Date().getSeconds();

    let is_five_sec = sec % 5 == 0;
    let is_five_mint = mint % 5 == 0 && sec == 0;

    if (is_five_sec) {
        run(sec, "live");
    }

    if (is_five_mint) {
        run(sec, "upcoming");
    }

}

setInterval(everySeconds, 1000);