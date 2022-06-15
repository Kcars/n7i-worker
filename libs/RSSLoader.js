const Parser = require("rss-parser");
const parser = new Parser();

const loadRSS = (channelId) => {
    return new Promise(async (resolve, reject) => {
        let rnd = new Date().getTime();
        let feed = { items: [] };
        let items = [];

        url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}&rnd=${rnd}`;

        try {
            feed = await parser.parseURL(url);
        } catch (err) {
            reject(`channelId: ${channelId} feed parse failed.`);
        }

        try {
            // 曾經有一個頻道同時開兩個直播過
            items = feed.items.slice(0, 2).map((item) => item.link.split("v=")[1]);
        } catch (err) {
            reject(`channelId: ${channelId} items parse failed.`);
        }

        resolve(items);
    });
}

exports.getVideoIds = async (channelIds) => {
    let output = [];
    
    for (channelId of channelIds) {
        let items = await loadRSS(channelId).catch((err) => console.log(err));
        output = output.concat(items);
    }

    return output;
}