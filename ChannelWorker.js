const channel = require("./Channel");

const rss = require("./libs/RSSLoader");
const itsukara = require("./libs/ITsukaraLoader");
const twitter = require("./libs/TwitterLoader");

const tools = require("./libs/Tools");

const channelIds = channel.getChannelIds();

const run = async () => {
    let dd = new Date();
    let mm = dd.getMinutes();
    let ss = dd.getSeconds();

    let oldVideoIds = await tools.getCurrentNotRecordVideoIds();
    let lastVideoIds = [];
    let videoIds = [];

    let logIds = [];

    // 每五分鐘
    if (mm % 5 == 0 && ss == 0) {
        videoIds = await rss.getVideoIds(channelIds);
        lastVideoIds = lastVideoIds.concat(videoIds);

        logIds.push(lastVideoIds.length);
    }

    // 每三分鐘
    if (mm % 3 == 0 && ss == 0) {
        videoIds = await itsukara.getVideoIds();
        lastVideoIds = lastVideoIds.concat(videoIds);

        logIds.push(lastVideoIds.length);
    }

    // 每二分鐘
    if (mm % 2 == 0 && ss == 0) {
        videoIds = await twitter.getVideoIds();
        lastVideoIds = lastVideoIds.concat(videoIds);

        logIds.push(lastVideoIds.length);
    }

    // 每分鐘
    if (ss == 0) {
        lastVideoIds = lastVideoIds.concat(oldVideoIds);
        logIds.push(lastVideoIds.length);
    }

    lastVideoIds = await tools.getNotRecordVideoIds(lastVideoIds);
    logIds.push(lastVideoIds.length);

    lastVideoIds = [...new Set(lastVideoIds)];
    logIds.push(lastVideoIds.length);

    if (lastVideoIds.length > 0) {
        let queues = tools.getChunkArray(lastVideoIds, 40);

        for (queue of queues) {
            await tools.parseVideoByIds(queue);
        }

        await tools.writeVideoJson();

        console.log(`mm: ${mm} , ss: ${ss} , lastVideoIds.len: ${lastVideoIds.length} , queues end.`);
    }
}

setInterval(run, 1000);
run();