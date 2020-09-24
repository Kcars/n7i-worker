n7i-worker
=================================

定時取得`にじさんじ`頻道訊息和聊天室留言。

# 簡單架構

```
---------------
| youtube RSS |  ↘
---------------                           [video info]
                            |---------------------------------------------↓
----------------   ------------------   ----------------     ------------------------  [stats/video_id.ndjson]
| itsukaralink | → | channel-worker | ↔ | redis server |     | google cloud storage |  [chats/video_id.ndjson]
----------------   ------------------   ----------------     ------------------------  [reports/video_id.json]
                                               ↕ 
---------------                         ---------------  [chat info]
| twitter api |  ↗          ↑          | chat-worker |      ↗                            
---------------                         ---------------
                            ｜          ↗
                  --------------------               
                  | youtube data api |    
                  --------------------               
```

# 資料來源

* itsukaralink
  官方的行事曆資料來源，每兩分鐘呼叫一次

* youtube RSS feed
  youtube頻道的RSS，每五分鐘呼叫一次(全頻道各一次)

* twitter api
  使用官方twitter的list取得全liver的tweet，取出tweet內的youtube網址

* youtube data api
  將所有直播中的影片以每分鐘為一個單位把資料寫成一筆JSON字串  
  聊天室留言將每一則留言寫成一筆JSON字串；由於API使用額度的關係，聊天室留言最快每十秒呼叫一次，最慢一分鐘一次
  每天中午十二點會取得頻道資訊並寫成檔案

