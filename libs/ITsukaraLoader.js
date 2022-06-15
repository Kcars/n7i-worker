const axios = require('axios');

const url = 'https://api.itsukaralink.jp/v1.2/events.json';

exports.getVideoIds = async () => {
    return new Promise((resolve, reject) => {
        axios(url).then((res) => {
            let events = res.data.data.events;
            let items = events.map((item) => item.url.split("v=")[1])
            resolve(items);
        }).catch(() => {
            reject(-1);
        })
    })

}