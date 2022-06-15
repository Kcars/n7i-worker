const setting = require("../setting.json");
const Twitter = require('twitter');

const client = new Twitter(setting.twitter);

exports.getVideoIds = async () => {
    return new Promise((resolve, reject) => {
        let method = "search/tweets";
        let q = `list:1071754025471664128 AND url:youtube`;
        let tweet_mode = "extended";
        let result_type = "recent"
        let count = 100;

        let option = { q, count, result_type, tweet_mode };


        client.get(method, option).then((tweets) => {
            if (tweets.statuses != null && tweets.statuses.length > 0) {
                let videoIds = tweets.statuses
                    .map((tweet) => tweet.entities.urls.map((url) => url.expanded_url))
                    .flat(1)
                    .filter((url) => url.indexOf("youtube.com/watch?v=") != -1 || url.indexOf("youtu.be") != -1)
                    .map((url) => url.indexOf("v=") != -1 ? url.split("v=")[1] : url.split("/")[url.split("/").length - 1])

                resolve(videoIds);
            }
        })
    })
}