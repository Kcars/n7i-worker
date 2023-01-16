const axios = require('axios');

const url = 'https://www.nijisanji.jp/api/streams?day_offset=0';

exports.getVideoIds = async () => {
    return new Promise((resolve, reject) => {
        axios(url).then((res) => {
            let events = res.data.data;
            let items = events.map((item) => item.attributes.url.split("v=")[1])
            resolve(items);
        }).catch(() => {
            reject(-1);
        })
    })

}