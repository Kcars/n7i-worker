const channel = require("./Channel");

const rss = require("./libs/RSSLoader");
//const itsukara = require("./libs/ITsukaraLoader");
const nijisanji = require("./libs/ITsukaraLoader");
const twitter = require("./libs/TwitterLoader");

const tools = require("./libs/Tools");

const channelIds = channel.getChannelIds();

const run = async () => {
    let dd = new Date();
    let mm = dd.getMinutes();
    let ss = dd.getSeconds();

    let oldVideoIds = [];
    let lastVideoIds = [];
    let videoIds = [];

    let logIds = [];

    try {
        await tools.getCurrentNotRecordVideoIds();
    } catch(err) {
        console.log('tools.getCurrentNotRecordVideoIds failed.');
    }

    // 每五分鐘
    if (mm % 5 == 0 && ss == 0) {
        try {
            videoIds = await rss.getVideoIds(channelIds);
        } catch(err) {
            console.log('rss.getVideoIds failed.');
        }

        lastVideoIds = lastVideoIds.concat(videoIds);

        logIds.push(lastVideoIds.length);
    }

    // 每三分鐘
    if (mm % 3 == 0 && ss == 0) {
        try {
            videoIds = await nijisanji.getVideoIds();
        } catch(err) {
            console.log('itsukara.getVideoIds failed.');
        }
        
        lastVideoIds = lastVideoIds.concat(videoIds);

        logIds.push(lastVideoIds.length);
    }

    // 每二分鐘
    if (mm % 2 == 0 && ss == 0) {
        try {
            videoIds = await twitter.getVideoIds();
        } catch(err) {
            console.log('twitter.getVideoIds failed.');
        }
        
        lastVideoIds = lastVideoIds.concat(videoIds);

        logIds.push(lastVideoIds.length);
    }

    // 每分鐘
    if (ss == 0) {
        lastVideoIds = lastVideoIds.concat(oldVideoIds);
        logIds.push(lastVideoIds.length);
    }

    try {
        lastVideoIds = await tools.getNotRecordVideoIds(lastVideoIds);
    } catch(err) {
        console.log('tools.getNotRecordVideoIds failed.');
    }
    
    logIds.push(lastVideoIds.length);

    lastVideoIds = [...new Set(lastVideoIds)];
    logIds.push(lastVideoIds.length);

    if (lastVideoIds.length > 0) {
        let queues = tools.getChunkArray(lastVideoIds, 40);

        for (queue of queues) {
            try {
                await tools.parseVideoByIds(queue);
            } catch(err) {
                console.log('tools.parseVideoByIds failed.');
            }
        }

        try {
            await tools.writeVideoJson();
        } catch(err) {
            console.log('tools.writeVideoJson failed.');
        }
        

        console.log(`mm: ${mm} , ss: ${ss} , lastVideoIds.len: ${lastVideoIds.length} , queues end.`);
    }
}

setInterval(run, 1000);
run();