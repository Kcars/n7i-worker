const tools = require("./libs/Tools");

const run = async () => {
    //let dd = new Date();
    //let mm = dd.getMinutes();
    //let ss = dd.getSeconds();

    let videoList = await tools.getVideoHashList('live');
    let liveVideoCount = videoList.length;

    for (video of videoList) {
        let videoId = video.id;
        let liveViewCount = video.live_view_count; // 由於API呼叫額度問題 所以打算用線上人數決定呼叫間隔
        let delay = video.delay == null ? 0 : video.delay - 1;
        let isPrivate = video.is_private != null ? video.is_private : false;
        let videoStatus = video.status;

        if (delay <= 0 && videoStatus == 'live' && isPrivate != 'y') {
            let chatInfo = await tools.getLiveChat(video);

            if (chatInfo.result) {
                let newToken = chatInfo.nextPageToken;
                let newDelay = 60; // 預設每分鐘

                newDelay = liveViewCount > 5000 ? 30 : newDelay; // 超過五千人則每三十秒
                newDelay = liveViewCount > 10000 ? 15 : newDelay; // 超過萬人則每十秒

                newDelay = liveVideoCount > 50 ? 60 : newDelay; // 同時直播數超過N的時候改成固定每分鐘呼叫一次

                await tools.incrVideoHash(videoId, 'delay', newDelay);
                await tools.setVideoHash(videoId, 'token', newToken);

                console.log(`videoId: ${videoId} , play_time: ${video.play_time} , online: ${video.live_view_count} , newDelay: ${newDelay} , itemCount: ${chatInfo.itemCount} , totalNewSponsor: ${chatInfo.totalNewSponsor} , totalAmountMicros: ${chatInfo.totalAmountMicros}`);
            } else {
                if (chatInfo.errReason == 'forbidden') { // 會限
                    await tools.setVideoHash(videoId, 'is_private', 'y');
                }

                // 額度滿/呼叫錯誤的時候延後呼叫時間
                if (chatInfo.errReason == 'quotaExceeded') {
                    await tools.incrVideoHash(videoId, 'delay', 120);
                } else {
                    await tools.incrVideoHash(videoId, 'delay', 60);
                }

                console.log(`[WARN] videoId: ${videoId} , errReason: ${chatInfo.errReason}`);
            }
        } else {
            // 每秒遞減delay值
            await tools.incrVideoHash(videoId, 'delay', -1);
        }
    }
}

setInterval(run, 1000);
run();