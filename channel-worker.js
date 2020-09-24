const redis = require("redis");
const redis_client = redis.createClient({ host: "127.0.0.1", port: 6379 });

const KEY_YOUTUBE_LIVE_IDS = "youtube_live_ids";
const KEY_YOUTUBE_UPCOMING_IDS = "youtube_upcoming_ids";
const KEY_YOUTUBE_OLD_IDS = "youtube_old_ids";

const config = require("./config.json");

////

const Parser = require("rss-parser");
const parser = new Parser();

//// 

const rq = require("request");

const part = "id,snippet,statistics,liveStreamingDetails";
const url_stat = "https://www.googleapis.com/youtube/v3/videos";

////

const async = require("async");
const fs = require("fs");

////

let record_list = [];

let obj_list = {};

function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index + chunk_size);
        tempArray.push(myChunk);
    }

    return tempArray;
}

async function getVideoInfo(item, update_time) {
    return new Promise((resolve, reject) => {
        let channel_id = "";
        let id = "";
        let title = "";
        let channel_title = "";
        //      let thum = "";
        let type = "";
        let tags = "";
        let view_count = 0;
        let like_count = 0;
        let dislike_count = 0;
        let fav_count = 0;
        let comment_count = 0;
        let update_time_num = update_time.getTime();

        let chat_id = "";
        let live_sch_time = 0;
        let live_start_time = 0;
        //      let live_end_time = null;
        let live_view_count = 0;

        update_time = update_time.toISOString();

        channel_id = item.snippet.channelId;
        id = item.id;
        title = item.snippet.title;
        channel_title = item.snippet.channelTitle;
        //      thum = item.snippet.thumbnails.medium.url;
        type = item.snippet.liveBroadcastContent;
        tags = item.snippet.tags != null ? item.snippet.tags.join(",") : "";

        view_count = item.statistics.viewCount != null ? item.statistics.viewCount : 0;
        like_count = item.statistics.likeCount != null ? item.statistics.likeCount : 0;
        dislike_count = item.statistics.dislikeCount != null ? item.statistics.dislikeCount : 0;
        fav_count = item.statistics.favoriteCount != null ? item.statistics.favoriteCount : 0;
        comment_count = item.statistics.commentCount != null ? item.statistics.commentCount : 0;

        if (item.liveStreamingDetails != null) {
            chat_id = item.liveStreamingDetails.activeLiveChatId != null ? item.liveStreamingDetails.activeLiveChatId : "";
            live_sch_time = item.liveStreamingDetails.scheduledStartTime != null ? item.liveStreamingDetails.scheduledStartTime : 0;
            live_start_time = item.liveStreamingDetails.actualStartTime != null ? item.liveStreamingDetails.actualStartTime : 0;
            //          live_end_time = item.liveStreamingDetails.actualEndTime;
            live_view_count = item.liveStreamingDetails.concurrentViewers != null ? item.liveStreamingDetails.concurrentViewers : 0;
        }

        live_sch_time = live_sch_time == null ? 0 : live_sch_time;
        live_start_time = live_start_time == null ? 0 : live_start_time;

        ////

        if (config.user_list.indexOf(channel_id) != -1) {
            redis_client.hset(`youtube_live:${id}`, "channel_id", channel_id);
            redis_client.hset(`youtube_live:${id}`, "channel_title", channel_title);
            redis_client.hset(`youtube_live:${id}`, "title", title);
            redis_client.hset(`youtube_live:${id}`, "tags", tags);
            redis_client.hset(`youtube_live:${id}`, "view_count", view_count);
            redis_client.hset(`youtube_live:${id}`, "like_count", like_count);
            redis_client.hset(`youtube_live:${id}`, "dislike_count", dislike_count);
            redis_client.hset(`youtube_live:${id}`, "fav_count", fav_count);
            redis_client.hset(`youtube_live:${id}`, "comment_count", comment_count);

            redis_client.hset(`youtube_live:${id}`, "chat_id", chat_id);
            redis_client.hset(`youtube_live:${id}`, "sch_time", live_sch_time);
            redis_client.hset(`youtube_live:${id}`, "start_time", live_start_time);
            redis_client.hset(`youtube_live:${id}`, "live_view_count", live_view_count);

            ////

            redis_client.hgetall(`youtube_live:${id}`, (err, item) => {
                let new_sponsor = item.new_sponsor != null ? item.new_sponsor : 0;
                let amount_micros = item.amount_micros != null ? item.amount_micros : 0;
                let chat = item.chat != null ? item.chat : 0;
                let chat_total = item.chat_total != null ? item.chat_total : 0;
                let play_time = item.play_time != null ? item.play_time : "0";
                let record_str = "";

                let obj = {
                    id, channel_id, channel_title, title, tags, view_count, like_count, dislike_count, fav_count, comment_count,
                    chat_id, live_sch_time, live_start_time, live_view_count, update_time, update_time_num, new_sponsor, amount_micros, chat, chat_total, play_time
                };

                obj_list[id] = obj;

                record_str = `${JSON.stringify(obj_list[id])}\r\n`;

                if (type == "none") {
                    let mm = new Date(live_start_time).getMonth() + 1;

                    //if (play_time != "0" && play_time != "00:00:00" && chat_total > 0) {
                    doAppendRecord(mm, id, record_str);
                    //} else {
                    //console.log(`[WARN][${id}] doAppendRecord check failed. play_time: ${play_time} , chat_total: ${chat_total}`);
                    //}

                    redis_client.srem(KEY_YOUTUBE_LIVE_IDS, id);
                    redis_client.srem(KEY_YOUTUBE_UPCOMING_IDS, id);

                    redis_client.del(`youtube_message_ids:${id}`);
                } else {
                    redis_client.srem(KEY_YOUTUBE_OLD_IDS, id);

                    if (live_start_time == 0) {
                        if (id != null && id != "") {
                            redis_client.sadd(KEY_YOUTUBE_UPCOMING_IDS, id);
                            redis_client.srem(KEY_YOUTUBE_LIVE_IDS, id);
                        }

                    } else {
                        if (id != null && id != "") {
                            redis_client.sadd(KEY_YOUTUBE_LIVE_IDS, id);
                            redis_client.srem(KEY_YOUTUBE_UPCOMING_IDS, id);
                        }
                    }

                    if (live_start_time != "0") {
                        //console.log(`📣 ${id} 👑  ${channel_title} 💬 ${title} 👨‍👨‍👧‍👧 ${live_view_count}/${view_count} 🎛 ${live_start_time}`);
                    }

                    if (obj_list[id] != null && live_start_time != 0) {
                        fs.appendFile(`./stats/${id}.ndjson`, record_str, (err, res) => {
                        });
                    }
                }

                resolve(true);
            });
        } else {
            console.log(`[WARN] channel_id not in user_list: channel_id: ${channel_id} , video_id: ${id}`);
        }
    });
}

async function getVideoInfoList(id_list) {
    return new Promise((resolve, reject) => {
        let key = config.key;
        let id = id_list.join(",");
        let update_time = new Date();

        if (id_list.length > 0) {
            rq(url_stat, { qs: { key, part, id } }, (err, res) => {
                let info = JSON.parse(res.body);

                if (!err) {
                    let id_list_new = [];

                    if (info.items != null && info.items.length > 0) {
                        info.items.forEach(async (item) => {
                            id_list_new.push(item.id);
                            await getVideoInfo(item, update_time);
                        });

                        if (id_list.length != id_list_new.length) {
                            console.log(`[WARN] getVideoInfoList.length failed. ${id_list.length} != ${id_list_new.length}`);
                            id_list.forEach((old_id) => {
                                if (id_list_new.indexOf(old_id) == -1) {
                                    console.log(`[INFO] clear id: ${old_id}`);

                                    if (old_id != null && old_id != "") {
                                        //redis_client.sadd(KEY_YOUTUBE_OLD_IDS, old_id);

                                        redis_client.srem(KEY_YOUTUBE_LIVE_IDS, old_id);
                                        redis_client.srem(KEY_YOUTUBE_UPCOMING_IDS, old_id);

                                        //redis_client.del(`youtube_live:${old_id}`);
                                        //redis_client.del(`youtube_message_ids:${old_id}`);

                                        delete obj_list[old_id];
                                    }
                                }
                            })
                        }

                        resolve(true);
                    } else {
                        let error_info = info.error.errors[0];

                        console.log(`[WARN] youtube data api error. domain: ${error_info.domain} , reason: ${error_info.reason}`);

                        resolve(true);
                    }
                } else {
                    console.log(err);
                    resolve(true);
                }
            })
        } else {
            resolve(true);
        }
    });
}

async function doParseItem(item) {
    return new Promise(async (resolve, reject) => {
        let vcode = item.link.split("?v=")[1];
        resolve(vcode);
    });
}

async function doParseVideoList(list) {
    return new Promise(async (resolve, reject) => {
        list_video_id = [];

        list.forEach(async (item) => {
            let video_id = await doParseItem(item);
            list_video_id.push(video_id);
        });

        resolve(list_video_id);
    });
}

function doAppendRecord(check_mm, check_val, val) {
    let date = new Date();
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let path = "";

    mm = mm < 10 ? `0${mm}` : mm;
    path = `./stats/records-${yy}${mm}.ndjson`;

    redis_client.del(`youtube_live:${check_val}`);
    redis_client.del(`youtube_message_ids:${check_val}`);

    redis_client.srem(KEY_YOUTUBE_LIVE_IDS, check_val);
    redis_client.srem(KEY_YOUTUBE_UPCOMING_IDS, check_val);

    redis_client.sadd(KEY_YOUTUBE_OLD_IDS, check_val);

    record_list = record_list.length >= 10000 ? [] : record_list;
    record_list = record_list.concat([check_val]);

    if (mm == check_mm) {
        fs.readFile(path, (err, output) => {
            let content = output != null && output != "" ? output.toString("utf8") : "";
            let not_append = content.indexOf(`{"id":"${check_val}"`) == -1 || content == "";

            if (not_append) {
                fs.appendFile(path, val, (err, res) => {
                    console.log(`[INFO] video_id: ${check_val} append to records.`);
                });
            }
        });
    }
}

function doReport() {
    let timestamp = new Date().toISOString();
    let timestamp_num = new Date().getTime();
    let output_list = {
        timestamp
        , timestamp_num
        , "upcoming": [

        ]
        , "live": [

        ]
    };

    if (obj_list != null && Object.keys(obj_list).length > 0) {
        Object.keys(obj_list).forEach((key) => {
            let val = obj_list[key];
            let live_start_time = val.live_start_time;
            let live_sch_time = val.live_sch_time;
            let onlines = val.live_view_count;

            if (live_sch_time != 0 && live_start_time == 0) { // not live streaming
                let start_time_num = new Date(live_sch_time).getTime();
                let now_time = new Date();
                let now_time_num = start_time_num;
                let is_delay = false;

                now_time.setHours(new Date().getHours() - 1);
                now_time_num = now_time.getTime();

                is_delay = start_time_num < now_time_num;

                if (!is_delay) {
                    output_list.upcoming.push(val);
                }
            } else { // live streaming
                if (onlines > 0) {
                    output_list.live.push(val);
                }
            }
        });

        fs.writeFile(`./stats/video.json`, JSON.stringify(output_list), (err, res) => {

        });
    } else {
        console.log(`[WARN][doReport] video.json not update.`);
    }
}

function doCheckVideoIds(list, source_type) {
    let total_video_id_list = [];

    redis_client.smembers(KEY_YOUTUBE_LIVE_IDS, async (err, live_list) => {
        redis_client.smembers(KEY_YOUTUBE_OLD_IDS, async (err, old_list) => {
            exist_list = live_list.concat(old_list);

            async.eachSeries(list, async (video_id, next) => {
                if (exist_list.indexOf(video_id) == -1 && record_list.indexOf(video_id) == -1) {
                    total_video_id_list.push(video_id);
                }
            }, async () => {
                console.log(`[INFO] source_type: ${source_type} , before length: ${list.length} , after length: ${total_video_id_list.length} , exist_list length: [${exist_list.length}][${record_list.length}]`);

                let work_list = chunkArray(total_video_id_list, 40);

                work_list.forEach((sub_list) => {
                    getVideoInfoList(sub_list);
                });

                if (exist_list.length > 1000) {
                    console.log(`[INFO] clear KEY_YOUTUBE_OLD_IDS`);
                    redis_client.del(KEY_YOUTUBE_OLD_IDS);
                }
            })
        });
    });
}

function doCallRSSFeed() {
    console.log(`${new Date().toISOString()} [INFO] user_count: ${config.user_list.length}`);

    let list_video_id = [];

    async.eachSeries(config.user_list, (user, next) => {
        setTimeout(async () => {
            let rnd = new Date().getTime();
            let feed = { items: [] };
            let items = null;
            let ids = null;

            url = `https://www.youtube.com/feeds/videos.xml?channel_id=${user}&rnd=${rnd}`;

            try {
                feed = await parser.parseURL(url);
            } catch (err) {
                console.log(err);
            }

            items = feed.items.slice(0, 2); // 2 item

            ids = await doParseVideoList(items);

            list_video_id = list_video_id.concat(ids);

            next();
        }, 2500);
    }, async () => {
        doCheckVideoIds(list_video_id, "rss");
    })
}

function doCallJSONFeeds() {
    let rnd = new Date().getTime();
    let url = `https://api.itsukaralink.jp/v1.2/events.json&rnd=${rnd}`;
    let total_video_id_list = [];

    rq(url, async (err, res) => {
        let list = [];
        if (!err) {
            let info = null;

            try {
                info = JSON.parse(res.body);
                list = info.data.events;
            } catch (er) {
                console.log(`[ERROR] api.itsukaralink.jp parse failed.`);
            }

            if (list != null && list.length > 0) {
                async.eachSeries(list, async (item, next) => {
                    let event_time_num = new Date(item.start_date).getTime();
                    let now_time_num = new Date().getTime();
                    let diff_num = (now_time_num - event_time_num) / 1000;

                    if (Math.abs(diff_num) < 3600 * 6) { // 
                        let video_id = await doParseItem({ link: item.url });
                        total_video_id_list.push(video_id);
                    }
                }, async () => {
                    /*getYouTubeIdsFromTwitter().then((list_from_twitter) => {
                        console.log(`[DEBUG] json_video_id_list.length: ${total_video_id_list.length} , list_from_twitter.length: ${list_from_twitter.length}`);
                        total_video_id_list = total_video_id_list.concat(list_from_twitter);
                        doCheckVideoIds(total_video_id_list, "json");
                    })*/

                    doCheckVideoIds(total_video_id_list, "json");
                })
            } else {
                console.log(`[WARN] api.itsukaralink.jp result is empty.`);
            }
        } else {
            console.log(`[ERROR] api.itsukaralink.jp load failed.`);
        }
    });
}

function getYouTubeIdsFromTwitter(key = "twitter_youtube_ids", left = 0, right = 39) {
    return new Promise((resolve, reject) => {
        redis_client.LRANGE(key, left, right, (err, list) => {
            let rem_count = right + 1;
            redis_client.ltrim(key, rem_count, -1, (err, res) => {
                doCheckVideoIds(list, "twitter");
                resolve(list);
            })
        })
    })
}

function everySeconds() {
    let mint = new Date().getMinutes();
    let sec = new Date().getSeconds();

    let is_every_min_2 = mint % 2 == 0 && sec == 0;
    let is_every_min_5 = mint % 5 == 0 && sec == 0;

    if (sec == 0) { // every minute 0 seconds
        redis_client.smembers(KEY_YOUTUBE_LIVE_IDS, async (err, live_list) => {
            await getVideoInfoList(live_list);
            await doReport();
        });
    }

    if (sec == 0 || sec == 30) {
        getYouTubeIdsFromTwitter();
    }

    if (is_every_min_2) {
        doCallJSONFeeds();
    }

    if (is_every_min_5) {
        doCallRSSFeed();
    }
}

setInterval(everySeconds, 1000);

//redis_client.del(KEY_YOUTUBE_OLD_IDS);