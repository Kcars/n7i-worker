// channel_name只是編輯時確認用
// 不另外放json檔是想要寫註解
// keyword: browse_id
const channelList = [

    { "lang": "jp", "channel_id": "UCX7YkU9nEeaoZbkVLVajcMg", "display_name": "にじさんじ", "channel_name": "にじさんじ", "color": "#FFFFFF" },

    { "lang": "jp", "channel_id": "UCD-miitqNY3nyukJ4Fnf4_A", "display_name": "月ノ美兎", "channel_name": "月ノ美兎", "color": "#E43F3B" },
    { "lang": "jp", "channel_id": "UCLO9QDxVL4bnvRRsz6K4bsQ", "display_name": "勇気ちひろ", "channel_name": "勇気ちひろ", "color": "#7BB3EE" },
    { "lang": "jp", "channel_id": "UCYKP16oMX9KKPbrNgo_Kgag", "display_name": "える", "channel_name": "える / Elu【にじさんじ】", "color": "#E2364F" },
    { "lang": "jp", "channel_id": "UCsg-YqdqQ-KFF0LNk23BY4A", "display_name": "樋口楓", "channel_name": "樋口楓【にじさんじ所属】", "color": "#FBAF71" },
    { "lang": "jp", "channel_id": "UC6oDys1BGgBsIC3WhG1BovQ", "display_name": "静凛", "channel_name": "Shizuka Rin Official", "color": "#745399" },
    { "lang": "jp", "channel_id": "UCeK9HFcRZoTrvqcUCtccMoQ", "display_name": "渋谷ハジメ", "channel_name": "渋谷ハジメのはじめ支部", "color": "#D7FAD7" },
    { "lang": "jp", "channel_id": "UCpnvhOIJ6BN-vPkYU9ls-Eg", "display_name": "鈴谷アキ", "channel_name": "鈴谷アキの陽だまりの庭", "color": "#F2F9C3" },
    { "lang": "jp", "channel_id": "UCvmppcdYf4HOv-tFQhHHJMA", "display_name": "モイラ", "channel_name": "《にじさんじ所属の女神》モイラ", "color": "#91ABD0" },
    //
    { "lang": "jp", "channel_id": "UCwokZsOK_uEre70XayaFnzA", "display_name": "鈴鹿詩子", "channel_name": "鈴鹿詩子 Utako Suzuka", "color": "#FA4F62" },
    { "lang": "jp", "channel_id": "UCmUjjW5zF1MMOhYUwwwQv9Q", "display_name": "宇志海いちご", "channel_name": "宇志海いちご", "color": "#FFCACE" },
    { "lang": "jp", "channel_id": "UC_GCs6GARLxEHxy1w40d6VQ", "display_name": "家長むぎ", "channel_name": "家長むぎ【にじさんじ所属】", "color": "#FF899D" },
    { "lang": "jp", "channel_id": "UC48jH1ul-6HOrcSSfoR02fQ", "display_name": "夕陽リリ", "channel_name": "Yuhi Riri Official", "color": "#BFFFFF" },
    { "lang": "jp", "channel_id": "UCt0clH12Xk1-Ej5PXKGfdPA", "display_name": "物述有栖", "channel_name": "♥️♠️物述有栖♦️♣️", "color": "#81D4E2" },
    { "lang": "jp", "channel_id": "UCBiqkFJljoxAj10SoP2w2Cg", "display_name": "文野環", "channel_name": "文野環【にじさんじの野良猫】ふみのたまき", "color": "#EBDDB4" },
    { "lang": "jp", "channel_id": "UCXU7YYxy_iQd3ulXyO-zC2w", "display_name": "伏見ガク", "channel_name": "伏見ガク【にじさんじ所属】", "color": "#FFCB5B" },
    { "lang": "jp", "channel_id": "UCUzJ90o1EjqUbk2pBAy0_aw", "display_name": "ギルザレンIII世", "channel_name": "Gilzaren III Season 2", "color": "#002FA7" },
    { "lang": "jp", "channel_id": "UCv1fFr156jc65EMiLbaLImw", "display_name": "剣持刀也", "channel_name": "剣持刀也", "color": "#A590AF" },
    { "lang": "jp", "channel_id": "UCtpB6Bvhs1Um93ziEDACQ8g", "display_name": "森中花咲", "channel_name": "森中花咲", "color": "#C8F39A" },
    //
    { "lang": "jp", "channel_id": "UCspv01oxUFf_MTSipURRhkA", "display_name": "叶", "channel_name": "Kanae Channel", "color": "#ABD3D8" },
    { "lang": "jp", "channel_id": "UCBi8YaVyZpiKWN3_Z0dCTfQ", "display_name": "赤羽葉子", "channel_name": "赤羽葉子ちゃんねる", "color": "#CA636C" },
    { "lang": "jp", "channel_id": "UCoztvTULBYd3WmStqYeoHcA", "display_name": "笹木咲", "channel_name": "笹木咲 / Sasaki Saku", "color": "#EF9AAF" },
    { "lang": "jp", "channel_id": "UC0g1AE0DOjBYnLhkgoRWN1w", "display_name": "本間ひまわり", "channel_name": "本間ひまわり - Himawari Honma -", "color": "#FBE340" },
    { "lang": "jp", "channel_id": "UC9EjSJ8pvxtvPdxLOElv73w", "display_name": "魔界ノりりむ", "channel_name": "魔界ノりりむ", "color": "#EF6F94" },
    { "lang": "jp", "channel_id": "UCSFCh5NL4qXrAy9u-u2lX3g", "display_name": "葛葉", "channel_name": "Kuzuha Channel", "color": "#ACA7BB" },
    { "lang": "jp", "channel_id": "UC_4tXjqecqox5Uc05ncxpxg", "display_name": "椎名唯華", "channel_name": "椎名唯華 / Shiina Yuika", "color": "#F1C8DE" },
    //
    { "lang": "jp", "channel_id": "UC53UDnhAAYwvNO7j_2Ju1cQ", "display_name": "ドーラ", "channel_name": "ドーラ", "color": "#A83E4A" },
    { "lang": "jp", "channel_id": "UCRV9d6YCYIMUszK-83TwxVA", "display_name": "轟京子", "channel_name": "轟京子/kyoko todoroki【にじさんじ】", "color": "#F8A69A" },
    { "lang": "jp", "channel_id": "UC1zFJrfEKvCixhsjNSb1toQ", "display_name": "シスター・クレア", "channel_name": "シスター・クレア -SisterClaire-", "color": "#DFC6A8" },
    { "lang": "jp", "channel_id": "UCsFn_ueskBkMCEyzCEqAOvg", "display_name": "花畑チャイカ", "channel_name": "花畑チャイカ", "color": "#40CF84" },
    { "lang": "jp", "channel_id": "UCKMYISTJAQ8xTplUPHiABlA", "display_name": "社築", "channel_name": "社築", "color": "#B6C6F2" },
    { "lang": "jp", "channel_id": "UC6TfqY40Xt1Y0J-N18c85qQ", "display_name": "安土桃", "channel_name": "安土桃", "color": "#F295CE" },
    { "lang": "jp", "channel_id": "UCryOPk2GZ1meIDt53tL30Tw", "display_name": "鈴木勝", "channel_name": "鈴木勝 / Suzuki Masaru【にじさんじ】", "color": "#7B788A" },
    { "lang": "jp", "channel_id": "UCt5-0i4AVHXaWJrL8Wql3mw", "display_name": "緑仙", "channel_name": "緑仙 / Ryushen", "color": "#5DCCAB" },
    { "lang": "jp", "channel_id": "UC3lNFeJiTq6L3UWoz4g1e-A", "display_name": "卯月コウ", "channel_name": "卯月コウ", "color": "#F9E97A" },
    //
    { "lang": "jp", "channel_id": "UCWz0CSYCxf4MhRKPDm220AQ", "display_name": "神田笑一", "channel_name": "神田笑一 / Kanda Shoichi【 にじさんじ 】", "color": "#F4D35B" },
    { "lang": "jp", "channel_id": "UCiSRx1a2k-0tOg-fs6gAolQ", "display_name": "飛鳥ひな", "channel_name": "飛鳥ひな【にじさんじ所属】", "color": "#FAD8DC" },
    { "lang": "jp", "channel_id": "UCtAvQ5U0aXyKwm2i4GqFgJg", "display_name": "春崎エアル", "channel_name": "春崎エアル", "color": "#4B5F9E" },
    { "lang": "jp", "channel_id": "UCRWOdwLRsenx2jLaiCAIU4A", "display_name": "雨森小夜", "channel_name": "雨森小夜", "color": "#756F7D" },
    { "lang": "jp", "channel_id": "UCV5ZZlLjk5MKGg3L0n0vbzw", "display_name": "鷹宮リオン", "channel_name": "鷹宮リオン / Rion Takamiya", "color": "#CC3D7B" },
    { "lang": "jp", "channel_id": "UCJubINhCcFXlsBwnHp0wl_g", "display_name": "舞元啓介", "channel_name": "舞元啓介", "color": "#094078" },
    { "lang": "jp", "channel_id": "UCPvGypSgfDkVe7JG2KygK7A", "display_name": "竜胆尊", "channel_name": "竜胆 尊 / Rindou Mikoto", "color": "#745BFF" },
    { "lang": "jp", "channel_id": "UCjlmCrq4TP1I4xguOtJ-31w", "display_name": "でびでび・でびる", "channel_name": "でびでび・でびる", "color": "#444C7D" },
    { "lang": "jp", "channel_id": "UCfQVs_KuXeNAlGa3fb8rlnQ", "display_name": "桜凛月", "channel_name": "桜凛月", "color": "#C57FC7" },
    { "lang": "jp", "channel_id": "UCo7TRj3cS-f_1D9ZDmuTsjw", "display_name": "町田ちま", "channel_name": "町田ちま【にじさんじ】", "color": "#EDDDBB" },
    { "lang": "jp", "channel_id": "UChUJbHiTVeGrSkTdBzVfNCQ", "display_name": "ジョー・力一", "channel_name": "ジョー・力一 Joe Rikiichi", "color": "#D598DD" },
    { "lang": "jp", "channel_id": "UCoM_XmK45j504hfUWvN06Qg", "display_name": "成瀬鳴", "channel_name": "成瀬 鳴 / Naruse Naru【にじさんじ】", "color": "#E06489" },
    { "lang": "jp", "channel_id": "UCbc8fwhdUNlqi-J99ISYu4A", "display_name": "ベルモンド・バンデラス", "channel_name": "ベルモンド・バンデラス", "color": "#683D46" },
    { "lang": "jp", "channel_id": "UCvzVB-EYuHFXHZrObB8a_Og", "display_name": "矢車りね", "channel_name": "矢車りね - Rine Yaguruma -", "color": "#FEECD8" },
    { "lang": "jp", "channel_id": "UCTIE7LM5X15NVugV7Krp9Hw", "display_name": "夢追翔", "channel_name": "夢追翔のJUKE BOX", "color": "#AC324B" },
    { "lang": "jp", "channel_id": "UCmeyo5pRj_6PXG-CsGUuWWg", "display_name": "黒井しば", "channel_name": "黒井しば【にじさんじの犬】", "color": "#585C82s" },
    //
    { "lang": "jp", "channel_id": "UCeShTCVgZyq2lsBW9QwIJcw", "display_name": "郡道美玲", "channel_name": "【3年0組】郡道美玲の教室", "color": "#A20063" },
    { "lang": "jp", "channel_id": "UCCVwhI5trmaSxfcze_Ovzfw", "display_name": "夢月ロア", "channel_name": "夢月ロア🌖Yuzuki Roa", "color": "#D8368D" },
    { "lang": "jp", "channel_id": "UCg63a3lk6PNeWhVvMRM_mrQ", "display_name": "小野町春香", "channel_name": "小野町 春香 / Onomachi Haruka 【にじさんじ】", "color": "#FF336E" },
    { "lang": "jp", "channel_id": "UCufQu4q65z63IgE4cfKs1BQ", "display_name": "語部紡", "channel_name": "語部紡", "color": "#07A4E3" },
    { "lang": "jp", "channel_id": "UCHK5wkevfaGrPr7j3g56Jmw", "display_name": "瀬戸美夜子", "channel_name": "瀬戸 美夜子 - Miyako Seto", "color": "#C4FF2B" },
    { "lang": "jp", "channel_id": "UCXRlIK3Cw_TJIQC5kSJJQMg", "display_name": "戌亥とこ", "channel_name": "戌亥とこ -Inui Toko-", "color": "#9d3757" },
    { "lang": "jp", "channel_id": "UCHVXbQzkl3rDfsXWo8xi2qw", "display_name": "アンジュ・カトリーナ", "channel_name": "アンジュ・カトリーナ - Ange Katrina -", "color": "#C83C35" },
    { "lang": "jp", "channel_id": "UCZ1xuCK1kNmn5RzPYIZop3w", "display_name": "リゼ・ヘルエスタ", "channel_name": "リゼ・ヘルエスタ -Lize Helesta-", "color": "#42FFFF" },
    //
    { "lang": "jp", "channel_id": "UCNW1Ex0r6HsWRD4LCtPwvoQ", "display_name": "三枝明那", "channel_name": "三枝明那 / Saegusa Akina", "color": "#F03C31" },
    { "lang": "jp", "channel_id": "UC0WwEfE-jOM2rzjpdfhTzZA", "display_name": "愛園愛美", "channel_name": "愛園 愛美/Aizono Manami", "color": "#F98FB7" },
    { "lang": "jp", "channel_id": "UCHX7YpFG8rVwhsHCx34xt7w", "display_name": "雪城眞尋", "channel_name": "雪城眞尋/Yukishiro Mahiro【にじさんじ所属】", "color": "#B4E9FF" },
    { "lang": "jp", "channel_id": "UCIytNcoz4pWzXfLda0DoULQ", "display_name": "エクス・アルビオ", "channel_name": "エクス・アルビオ -Ex Albio-", "color": "#5C9BBC" },
    { "lang": "jp", "channel_id": "UCtnO2N4kPTXmyvedjGWdx3Q", "display_name": "レヴィ・エリファ", "channel_name": "レヴィ・エリファ-Levi Elipha- ", "color": "#E8E1E8" },
    { "lang": "jp", "channel_id": "UCfipDDn7wY-C-SoUChgxCQQ", "display_name": "葉山舞鈴", "channel_name": "葉山舞鈴 / Ohayama Ch.", "color": "#D9EC33" },
    { "lang": "jp", "channel_id": "UCUc8GZfFxtmk7ZwSO7ccQ0g", "display_name": "ニュイ・ソシエール", "channel_name": "ニュイ・ソシエール //[Nui Sociere]", "color": "#D24E5F" },
    //
    { "lang": "jp", "channel_id": "UCGYAYLDE7TZiiC8U6teciDQ", "display_name": "葉加瀬冬雪", "channel_name": "葉加瀬 冬雪 / Hakase Fuyuki", "color": "#EEFFFF" },
    { "lang": "jp", "channel_id": "UCmovZ2th3Sqpd00F5RdeigQ", "display_name": "加賀美ハヤト", "channel_name": "加賀美 ハヤト/Hayato Kagami", "color": "#B9ADB9" },
    { "lang": "jp", "channel_id": "UCL34fAoFim9oHLbVzMKFavQ", "display_name": "夜見れな", "channel_name": "夜見れな/yorumi rena【にじさんじ所属】", "color": "#F7265A" },
    //
    { "lang": "jp", "channel_id": "UCdpUojq0KWZCN9bxXnZwz5w", "display_name": "アルス・アルマル", "channel_name": "アルス・アルマル -ars almal- 【にじさんじ】", "color": "#7FD6E2" },
    { "lang": "jp", "channel_id": "UCnRQYHTnRLSF0cLJwMnedCg", "display_name": "相羽ういは", "channel_name": "相羽ういは〖Aiba Uiha〗にじさんじ所属", "color": "#324CAC" },
    //
    { "lang": "jp", "channel_id": "UCkIimWZ9gBJRamKF0rmPU8w", "display_name": "天宮こころ", "channel_name": "天宮 こころ / Amamya Ch.", "color": "#C5EDFF" },
    { "lang": "jp", "channel_id": "UCpNH2Zk2gw3JBjWAKSyZcQQ", "display_name": "エリー・コニファー", "channel_name": "エリー・コニファー / Eli Conifer【にじさんじ】", "color": "#DAFFF9" },
    { "lang": "jp", "channel_id": "UCIG9rDtgR45VCZmYnd-4DUw", "display_name": "ラトナ・プティ", "channel_name": "ラトナ・プティ -Ratna Petit -にじさんじ所属", "color": "#F8B759" },
    //
    { "lang": "jp", "channel_id": "UC2OacIzd2UxGHRGhdHl1Rhw", "display_name": "早瀬走", "channel_name": "早瀬 走 / Hayase Sou【にじさんじ所属】", "color": "#AA7BE8" },
    { "lang": "jp", "channel_id": "UC8C1LLhBhf_E2IBPLSDJXlQ", "display_name": "健屋花那", "channel_name": "健屋花那【にじさんじ】KanaSukoya", "color": "#FF2FA2" },
    { "lang": "jp", "channel_id": "UCHBhnG2G-qN0JrrWmMO2FTA", "display_name": "シェリン・バーガンディ", "channel_name": "シェリン・バーガンディ -Shellin Burgundy- 【にじさんじ】", "color": "#6C2735" },
    //
    { "lang": "jp", "channel_id": "UCwrjITPwG4q71HzihV2C7Nw", "display_name": "フミ", "channel_name": "フミ/にじさんじ", "color": "#F4E49D" },
    { "lang": "jp", "channel_id": "UC9V3Y3_uzU5e-usObb6IE1w", "display_name": "星川サラ", "channel_name": "星川サラ / Sara Hoshikawa", "color": "#FAB80D" },
    { "lang": "jp", "channel_id": "UCllKI7VjyANuS1RXatizfLQ", "display_name": "山神カルタ", "channel_name": "山神 カルタ / Karuta Yamagami", "color": "#384B5A" },
    //
    { "lang": "jp", "channel_id": "UCl1oLKcAq93p-pwKfDGhiYQ", "display_name": "えま★おうがすと", "channel_name": "えま★おうがすと / Emma★August【にじさんじ】", "color": "#B32F51" },
    { "lang": "jp", "channel_id": "UCb6ObE-XGCctO3WrjRZC-cw", "display_name": "ルイス・キャミー", "channel_name": "ルイス・キャミー", "color": "#E86A74" },
    { "lang": "jp", "channel_id": "UCerkculBD7YLc_vOGrF7tKg", "display_name": "魔使マオ", "channel_name": "魔使マオ -matsukai mao-", "color": "#C93965" },
    //
    { "lang": "jp", "channel_id": "UC6wvdADTJ88OfIbJYIpAaDA", "display_name": "不破湊", "channel_name": "不破 湊 / Fuwa Minato【にじさんじ】", "color": "#BF69F4" },
    { "lang": "jp", "channel_id": "UCuvk5PilcvDECU7dDZhQiEw", "display_name": "白雪巴", "channel_name": "白雪 巴/Shirayuki Tomoe", "color": "#6E3FE7" },
    { "lang": "jp", "channel_id": "UC1QgXt46-GEvtNjEC1paHnw", "display_name": "グウェル・オス・ガール", "channel_name": "グウェル・オス・ガール / Gwelu Os Gar 【にじさんじ】", "color": "#F04B2D" },
    //
    { "lang": "jp", "channel_id": "UCS-XXTgVkotkbkDnGEprXpg", "display_name": "ましろ", "channel_name": "ましろ / Mashiro", "color": "#1E2232" },
    { "lang": "jp", "channel_id": "UC-o-E6I3IC2q8sAoAuM6Umg", "display_name": "奈羅花", "channel_name": "奈羅花 - Naraka -", "color": "#A02655" },
    { "lang": "jp", "channel_id": "UCRcLAVTbmx2-iNcXSsupdNA", "display_name": "来栖夏芽", "channel_name": "来栖 夏芽-kurusu natsume-【にじさんじ】", "color": "#880223" },
    //
    { "lang": "jp", "channel_id": "UCuep1JCrMvSxOGgGhBfJuYw", "display_name": "フレン・E・ルスタリオ", "channel_name": "フレン・E・ルスタリオ", "color": "#EC1D2F" },
    { "lang": "jp", "channel_id": "UCmZ1Rbthn-6Jm_qOGjYsh5A", "display_name": "イブラヒム", "channel_name": "イブラヒム【にじさんじ】", "color": "#7CA1F0" },
    //
    { "lang": "jp", "channel_id": "UCXW4MqCQn-jCaxlX-nn-BYg", "display_name": "長尾景", "channel_name": "長尾 景 / Nagao Kei【にじさんじ】", "color": "#625DA1" },
    { "lang": "jp", "channel_id": "UCGw7lrT-rVZCWHfdG9Frcgg", "display_name": "弦月藤士郎", "channel_name": "弦月 藤士郎 / Genzuki Tojiro【にじさんじ】", "color": "#487591" },
    { "lang": "jp", "channel_id": "UCo2N7C-Z91waaR6lF3LL_jw", "display_name": "甲斐田晴", "channel_name": "甲斐田 晴 / Kaida Haru【にじさんじ】", "color": "#4DD7E3" },
    //
    { "lang": "jp", "channel_id": "UC_82HBGtvwN1hcGeOGHzUBQ", "display_name": "空星きらめ", "channel_name": "空星きらめ/Sorahoshi Kirame【にじさんじ】", "color": "#44DDF4" },
    //
    { "lang": "jp", "channel_id": "UCe_p3YEuYJb8Np0Ip9dk-FQ", "display_name": "朝日南アカネ", "channel_name": "朝日南アカネ / Asahina Akane 【にじさんじ】", "color": "#B7282E" },
    { "lang": "jp", "channel_id": "UCL_O_HXgLJx3Auteer0n0pA", "display_name": "周央サンゴ", "channel_name": "周央 サンゴ / Suo Sango【にじさんじ】", "color": "#EF8468" },
    { "lang": "jp", "channel_id": "UCebT4Aq-3XWb5je1S1FvR_A", "display_name": "東堂コハク", "channel_name": "東堂コハク/ Todo Kohaku [にじさんじ]", "color": "#EA930A" },
    { "lang": "jp", "channel_id": "UCRqBKoKuX30ruKAq05pCeRQ", "display_name": "北小路ヒスイ", "channel_name": "北小路ヒスイ / Kitakoji Hisui 【にじさんじ】", "color": "#38B48B" },
    { "lang": "jp", "channel_id": "UCkngxfPbmGyGl_RIq4FA3MQ", "display_name": "西園チグサ", "channel_name": "西園チグサ / Nishizono Chigusa", "color": "#3A8FB7" },
    //
    { "lang": "jp", "channel_id": "UCgmFrRcyH7d1zR9sIVQhFow", "display_name": "ローレン・イロアス", "channel_name": "ローレン・イロアス / Lauren Iroas【にじさんじ】", "color": "#C10E49" },
    { "lang": "jp", "channel_id": "UC-6rZgmxZSIbq786j3RD5ow", "display_name": "レオス・ヴィンセント", "channel_name": "レオス・ヴィンセント / Leos.Vincent【にじさんじ】", "color": "#234A87" },
    { "lang": "jp", "channel_id": "UCqjTqdVlvIipZXIKeCkHKUA", "display_name": "オリバー・エバンス", "channel_name": "オリバー・エバンス / Oliver Evans 【にじさんじ】", "color": "#BCC37E" },
    { "lang": "jp", "channel_id": "UCRm6lqtdxs_Qo6HeL-SRQ-w", "display_name": "レイン・パターソン", "channel_name": "レイン・パターソン／Lain Paterson【にじさんじ】", "color": "#F74848" },
    //
    { "lang": "jp", "channel_id": "UCAQDFeCTVdx90GtwohwjHzQ", "display_name": "天ヶ瀬むゆ", "channel_name": "天ヶ瀬 むゆ / Amagase Muyu 【にじさんじ】", "color": "#FA5578" },
    { "lang": "jp", "channel_id": "UCe22Bcwd_GCpTjLxn83zl7A", "display_name": "先斗寧", "channel_name": "先斗寧 / Ponto Nei 【にじさんじ】", "color": "#5A7DFF" },
    { "lang": "jp", "channel_id": "UCtHY-tP0dyykhTRMmnfPs_g", "display_name": "海妹四葉", "channel_name": "海妹四葉 / Umise Yotsuha 【にじさんじ】", "color": "#FFE632" },
    //
    { "lang": "jp", "channel_id": "UCgIfLpQvelloDi8I0Ycbwpg", "display_name": "壱百満天原サロメ", "channel_name": "壱百満天原サロメ / Hyakumantenbara Salome", "color": "#CD3796" },
    //
    { "lang": "jp", "channel_id": "UCC7rRD6P7RQcx0hKv9RQP4w", "display_name": "風楽奏斗", "channel_name": "風楽奏斗 / Fura Kanato", "color": "#FAD246" },
    { "lang": "jp", "channel_id": "UC4l9gz3q65lTBFfFtW5LLeA", "display_name": "渡会雲雀", "channel_name": "渡会雲雀 / Watarai Hibari", "color": "#192332" },
    { "lang": "jp", "channel_id": "UCcDDxnoQcezyTUzHg5uHaKg", "display_name": "四季凪アキラ", "channel_name": "四季凪アキラ / Shikinagi Akira", "color": "#235AAA" },
    { "lang": "jp", "channel_id": "UC5dJFf4m-mEcoyJRfhBljoA", "display_name": "セラフ・ダズルガーデン", "channel_name": "セラフ・ダズルガーデン / Seraph Dazzlegarden", "color": "#DC3C41" },
    //
    { "lang": "jp", "channel_id": "UCu-rV2gPtJ-CsGxe71z_BrQ", "display_name": "五十嵐梨花", "channel_name": "五十嵐梨花 / Igarashi Rika 【にじさんじ】", "color": "#FF8C3C" },
    { "lang": "jp", "channel_id": "UCUP8TmlO7NNra88AMqGU_vQ", "display_name": "小清水透", "channel_name": "小清水 透 / Koshimizu Toru【にじさんじ】", "color": "#CDA5FF" },
    { "lang": "jp", "channel_id": "UCtLfA_qUqCJtjXJM2ZR_keg", "display_name": "石神のぞみ", "channel_name": "石神のぞみ / Ishigami Nozomi【にじさんじ】", "color": "#E6325F" },
    { "lang": "jp", "channel_id": "UCivwPlOp0ojnMPZj5pNOPPA", "display_name": "ソフィア・ヴァレンタイン", "channel_name": "ソフィア・ヴァレンタイン / Sophia Valentine【にじさんじ】", "color": "#C8C3DC" },
    { "lang": "jp", "channel_id": "UCiA-trSZfB0i92V_-dyDqBw", "display_name": "倉持めると", "channel_name": "倉持めると / Kuramochi Meruto【にじさんじ】", "color": "#EB4682" },
    { "lang": "jp", "channel_id": "UClrQ7xhRBxS_v_-WuudGKmA", "display_name": "鏑木ろこ", "channel_name": "鏑木ろこ / Kaburaki Roco【にじさんじ】", "color": "#198CAA" },
    { "lang": "jp", "channel_id": "UCWRPqA0ehhWV4Hnp27PJCkQ", "display_name": "獅子堂あかり", "channel_name": "獅子堂 あかり / Shishido Akari【にじさんじ】", "color": "#FFD728" }, 
    //
    { "lang": "jp", "channel_id": "UCy8P3o5XlMpJGQY4WugzdNA", "display_name": "佐伯イッテツ", "channel_name": "佐伯イッテツ / Saiki Ittetsu【にじさんじ】", "color": "#8C4664" }, 
    { "lang": "jp", "channel_id": "UC1vawzfbCnRpHT9SJ5pHlHw", "display_name": "赤城ウェン", "channel_name": "赤城ウェン / Akagi Wen【にじさんじ】", "color": "#FF8C9B" }, 
    { "lang": "jp", "channel_id": "UCambvP8yxNDot4FzQc9cgiw", "display_name": "宇佐美リト", "channel_name": "宇佐美リト / Usami Rito【にじさんじ】", "color": "#FAC31E" }, 
    { "lang": "jp", "channel_id": "UCqXxS-9x9Ha_UiH6hG4kh5Q", "display_name": "緋八マナ", "channel_name": "緋八マナ / Hibachi Mana【にじさんじ】", "color": "#64C8F0" }, 
    //
    { "lang": "id", "channel_id": "UCZ5dNZsqBjBzbBl0l_IdmXg", "display_name": "Taka Radjiman", "channel_name": "Taka Radjiman【NIJISANJI / にじさんじ】", "color": "#303764" },
    { "lang": "id", "channel_id": "UCA3WE2WRSpoIvtnoVGq4VAw", "display_name": "ZEA Cornelia", "channel_name": "ZEA Cornelia【NIJISANJI】", "color": "#FBEC5D" },
    { "lang": "id", "channel_id": "UCpJtk0myFr5WnyfsmnInP-w", "display_name": "Hana Macchia", "channel_name": "Hana Macchia Ch.【NIJISANJI・にじさんじ】", "color": "#FFEFD5" },
    { "lang": "id", "channel_id": "UC8Snw5i4eOJXEQqURAK17hQ", "display_name": "Rai Galilei", "channel_name": "Rai Galilei【NIJISANJI / にじさんじ】", "color": "#7DF9FF" },
    { "lang": "id", "channel_id": "UCrR7JxkbeLY82e8gsj_I0pQ", "display_name": "Amicia Michella", "channel_name": "Amicia Michella【NIJISANJI / にじさんじ】", "color": "#45E101" },
    { "lang": "id", "channel_id": "UCkL9OLKjIQbKk2CztbpOCFg", "display_name": "Riksa Dhirendra", "channel_name": "Riksa Dhirendra【NIJISANJI】", "color": "#FF0103" },
    { "lang": "id", "channel_id": "UCk5r533QVMgJUdWwqegH2TA", "display_name": "Azura Cecillia", "channel_name": "Azura Cecillia Ch.", "color": "#1B486F" },
    { "lang": "id", "channel_id": "UCoWH3sDpeXG1aXmOxveX4KA", "display_name": "Nara Haramaung", "channel_name": "Nara Haramaung【 NIJISANJI / にじさんじ 】", "color": "#FEA191" },
    { "lang": "id", "channel_id": "UCyRkQSuhJILuGOuXk10voPg", "display_name": "Layla Alstroemeria", "channel_name": "Layla Alstroemeria【NIJISANJI / にじさんじ】", "color": "#F9CACA" },
    { "lang": "id", "channel_id": "UCjFu-9GHnabzSFRAYm1B9Dw", "display_name": "Etna Crimson", "channel_name": "Etna Crimson【NIJISANJI / にじさんじ】", "color": "#DC143C" },
    { "lang": "id", "channel_id": "UCHjeZylSgXDSnor8wUnwU_g", "display_name": "Bonnivier Pranaja", "channel_name": "Bonnivier Pranaja 【NIJISANJI / にじさんじ】", "color": "#00FFCD" },
    { "lang": "id", "channel_id": "UC5qSx7KzdRwbsO1QmJc4d-w", "display_name": "Siska Leontyne", "channel_name": "Siska Leontyne 【NIJISANJI / にじさんじ】", "color": "#FFDFA0" },
    { "lang": "id", "channel_id": "UCijNnZ-6m8g85UGaRAWuw7g", "display_name": "Nagisa Arcinia", "channel_name": "Nagisa Arcinia【NIJISANJI・にじさんじ】", "color": "#CC338B" },
    { "lang": "id", "channel_id": "UCMzVa7B8UEdrvUGsPmSgyjA", "display_name": "Derem Kado", "channel_name": "Derem Kado 【にじさんじ / NIJISANJI】", "color": "#F6D4DF" },
    { "lang": "id", "channel_id": "UC5yckZliCkuaEFbqzLBD7hQ", "display_name": "Reza Avanluna", "channel_name": "Reza Avanluna 【NIJISANJI / にじさんじ】", "color": "#765CB8" },
    { "lang": "id", "channel_id": "UCIBj1-d71vKjRftiauF50pg", "display_name": "Hyona Elatiora", "channel_name": "Hyona Elatiora【NIJISANJI / にじさんじ】", "color": "#800020" },
    { "lang": "id", "channel_id": "UCoJ0Ct-jdas4cLPpSp06gZg", "display_name": "Xia Ekavira", "channel_name": "Xia Ekavira【NIJISANJI / にじさんじ】", "color": "#F2F680" },
    { "lang": "id", "channel_id": "UCahgMxSIQ2zIRrPKhM6Mjvg", "display_name": "Mika Melatika", "channel_name": "Mika Melatika【NIJISANJI・にじさんじ】", "color": "#DDBFF8" },
    //
    { "lang": "kr", "channel_id": "UCUtKkGKef8BYMs3h-3zQm9A", "display_name": "ミン・スゥーハ", "channel_name": "민수하 /Suhaスハ【NIJISANJI】", "color": "#5AC8FF" },
    { "lang": "kr", "channel_id": "UCpRXCTyNNa-MnjhK6gisnRw", "display_name": "ガオン", "channel_name": "가온 ガオン GAON 【にじさんじ】", "color": "#F9E072" },
    { "lang": "kr", "channel_id": "UC5ek2GWKvUKFgnKSHuuCFrw", "display_name": "ソ・ナギ", "channel_name": "ナギ / Nagi 【にじさんじ】", "color": "#7C86DE" },
    { "lang": "kr", "channel_id": "UC7hffDQLKIEG-_zoAQkMIvg", "display_name": "明楽レイ", "channel_name": "明楽 レイ /아키라 레이 / Ray Akira 【にじさんじ】", "color": "#A9CEEC" },
    { "lang": "kr", "channel_id": "UCClwIqTUn5LDpFucHyaAhHg", "display_name": "イ・ロハ", "channel_name": "イ・ロハ / LeeRoha【にじさんじ】", "color": "#FF2649" },
    { "lang": "kr", "channel_id": "UCCHH0nWYXFZmtDS_4tvMxHQ", "display_name": "ヤン・ナリ", "channel_name": "ヤン・ナリ / Yang Nari 【にじさんじ】", "color": "#FFF8C8" },
    { "lang": "kr", "channel_id": "UClS6k3w1sPwlVFqK3-yID5A", "display_name": "リュ・ハリ", "channel_name": "ハリ / Ryu Hari 【にじさんじ】", "color": "#96CEEB" },
    { "lang": "kr", "channel_id": "UCnzZmBOSrQf2wDBbnsDajVw", "display_name": "オ・ジユ", "channel_name": "ジユ / Jiyu 【にじさんじ】 ", "color": "#F1F4F4" },
    { "lang": "kr", "channel_id": "UCeGendL8CO5RkffB6IFwHow", "display_name": "セフィナ", "channel_name": "セフィナ / Seffyna【にじさんじ】", "color": "#FFBDC9" },
    { "lang": "kr", "channel_id": "UCLjx3lqIkYkPCBJop8czJ2A", "display_name": "バン・ハダ", "channel_name": "Ban Hada | NIJISANJI", "color": "#DDBC0B" },
    { "lang": "kr", "channel_id": "UCrhhJPNsOqzNIkUfTABoSpg", "display_name": "ハ・ユン", "channel_name": "ハユン / HaYun 【にじさんじ】", "color": "#FFF9B0" },
    { "lang": "kr", "channel_id": "UCX88Pe54pxbJDSGIyGrzNdg", "display_name": "ナ・セラ", "channel_name": "ナ セラ / Na Sera【にじさんじ】", "color": "#FEECF3" },
    //
    { "lang": "en", "channel_id": "UCIeSUTOTkF9Hs7q3SGcO-Ow", "display_name": "Elira Pendora", "channel_name": "Elira Pendora 【NIJISANJI EN】", "color": "#95C8D8" },
    { "lang": "en", "channel_id": "UCP4nMSTdwU1KqYWu3UH5DHQ", "display_name": "Pomu Rainpuff", "channel_name": "Pomu Rainpuff 【NIJISANJI EN】", "color": "#258E70" },
    { "lang": "en", "channel_id": "UCu-J8uIXuLZh16gG-cT1naw", "display_name": "Finana Ryugu", "channel_name": "Finana Ryugu 【NIJISANJI EN】", "color": "#35D9AD" },
    { "lang": "en", "channel_id": "UCV1xUwfM2v2oBtT3JNvic3w", "display_name": "Selen Tatsuki", "channel_name": "Selen Tatsuki 【NIJISANJI EN】", "color": "#7E4EAC" },
    { "lang": "en", "channel_id": "UC4WvIIAo89_AzGUh1AZ6Dkg", "display_name": "Rosemi Lovelock", "channel_name": "Rosemi Lovelock【NIJISANJI EN】", "color": "#DC3753" },
    { "lang": "en", "channel_id": "UCgA2jKRkqpY_8eysPUs8sjw", "display_name": "Petra Gurin", "channel_name": "Petra Gurin【NIJISANJI EN】", "color": "#FFAE42" },
    { "lang": "en", "channel_id": "UCR6qhsLpn62WVxCBK1dkLow", "display_name": "Enna Alouette", "channel_name": "Enna Alouette【NIJISANJI EN】", "color": "#858ED1" },
    { "lang": "en", "channel_id": "UCkieJGn3pgJikVW8gmMXE2w", "display_name": "Nina Kosaka", "channel_name": "Nina Kosaka【NIJISANJI EN】", "color": "#660000" },
    { "lang": "en", "channel_id": "UCBURM8S4LH7cRZ0Clea9RDA", "display_name": "Reimu Endou", "channel_name": "Reimu Endou【NIJISANJI EN】", "color": "#B90B4A" },
    { "lang": "en", "channel_id": "UC47rNmkDcNgbOcM-2BwzJTQ", "display_name": "Millie Parfait", "channel_name": "Millie Parfait【NIJISANJI EN】", "color": "#FEBC87" },
    { "lang": "en", "channel_id": "UC4yNIKGvy-YUrwYupVdLDXA", "display_name": "Ike Eveland", "channel_name": "Ike Eveland【NIJISANJI EN】", "color": "#348EC7" },
    { "lang": "en", "channel_id": "UCIM92Ok_spNKLVB5TsgwseQ", "display_name": "Mysta Rias", "channel_name": "Mysta Rias 【NIJISANJI EN】", "color": "#C3552B" },
    { "lang": "en", "channel_id": "UCckdfYDGrjojJM28n5SHYrA", "display_name": "Vox Akuma", "channel_name": "Vox Akuma【NIJISANJI EN】", "color": "#960018" },
    { "lang": "en", "channel_id": "UC7Gb7Uawe20QyFibhLl1lzA", "display_name": "Luca Kaneshiro", "channel_name": "Luca Kaneshiro【NIJISANJI EN】", "color": "#D4AF37" },
    { "lang": "en", "channel_id": "UCG0rzBZV_QMP4MtWg6IjhEA", "display_name": "Shu Yamino", "channel_name": "Shu Yamino【NIJISANJI EN】", "color": "#A660A7" },
    { "lang": "en", "channel_id": "UCQ1zGxHrfEmmW4CPpBx9-qw", "display_name": "Alban Knox", "channel_name": "Alban Knox 【NIJISANJI EN】", "color": "#FF5F00" },
    { "lang": "en", "channel_id": "UCSc_KzY_9WYAx9LghggjVRA", "display_name": "Yugo Asuma", "channel_name": "Yugo Asuma 【NIJISANJI EN】", "color": "#1F51FF" },
    { "lang": "en", "channel_id": "UCGhqxhovNfaPBpxfCruy9EA", "display_name": "Fulgur Ovid", "channel_name": "Fulgur Ovid 【NIJISANJI EN】", "color": "#FF0000" },
    { "lang": "en", "channel_id": "UCuuAb_72QzK0M1USPMEl1yw", "display_name": "Sonny Brisko", "channel_name": "Sonny Brisko 【NIJISANJI EN】", "color": "#FFF321" },
    { "lang": "en", "channel_id": "UChJ5FTsHOu72_5OVx0rvsvQ", "display_name": "Uki Violeta", "channel_name": "Uki Violeta 【NIJISANJI EN】", "color": "#B600FF" },
    //
    { "lang": "en", "channel_id": "UCsb-1aJgiJXJH2feV-zlZRw", "display_name": "Kyo Kaneko", "channel_name": "Kyo Kaneko 【NIJISANJI EN】", "color": "#00AFCC" },
    { "lang": "en", "channel_id": "UCwaS8_S7kMiKA3izlTWHbQg", "display_name": "Maria Marionette", "channel_name": "Maria Marionette 【NIJISANJI EN】", "color": "#E55A9B" },
    { "lang": "en", "channel_id": "UCpzxZW5kghGnO5TmAFJQAVw", "display_name": "Aster Arcadia", "channel_name": "Aster Arcadia 【NIJISANJI EN】", "color": "#6662A4" },
    { "lang": "en", "channel_id": "UCN68LoM3khS4gdBMiWJO8WA", "display_name": "Aia Amare", "channel_name": "Aia Amare 【NIJISANJI EN】", "color": "#FFFEF7" },
    { "lang": "en", "channel_id": "UCKu59gTZ_rdEmerdx5rV4Yg", "display_name": "Ren Zotto", "channel_name": "Ren Zotto 【NIJISANJI EN】", "color": "#429B76" },
    { "lang": "en", "channel_id": "UCFgXWZOUZA2oYHNr6qDmsTQ", "display_name": "Scarle Yonaguni", "channel_name": "Scarle Yonaguni 【NIJISANJI EN】", "color": "#E60012" },
    //
    { "lang": "en", "channel_id": "UCy91xBlY_Brh3bnHxKtjrrg", "display_name": "Doppio Dropscythe", "channel_name": "Doppio Dropscythe【NIJISANJI EN】", "color": "#A50082" },
    { "lang": "en", "channel_id": "UCIairB9UMDvqSKfMdv1jmjg", "display_name": "Zaion LanZa", "channel_name": "Zaion LanZa【NIJISANJI EN】", "color": "#FFF462" },
    { "lang": "en", "channel_id": "UCz_ZRw6ak4Foy8zZy0kEprQ", "display_name": "Hex Haywire", "channel_name": "Hex Haywire【NIJISANJI EN】", "color": "#007199" },
    { "lang": "en", "channel_id": "UChKXd7oqD18qiIYBoRIHTlw", "display_name": "Meloco Kyoran", "channel_name": "Meloco Kyoran【NIJISANJI EN】", "color": "#A09BD8" },
    { "lang": "en", "channel_id": "UCO8WcDsF5znr-qsXlzZNpqg", "display_name": "Ver Vermillion ", "channel_name": "Ver Vermillion【NIJISANJI EN】", "color": "#D5345E" },
    { "lang": "en", "channel_id": "UCggO2c1unS-oLwTLT0ICywg", "display_name": "Kotoka Torahime", "channel_name": "Kotoka Torahime【NIJISANJI EN】", "color": "#DC6B9A" },
];

exports.channelList = channelList;

exports.getChannelIds = () => {
    return channelList.map((item) => item.channel_id)
}

exports.getDisplayName = (channelId) => {
    let output = '';

    try {
        output = channelList.find(item => item.channel_id == channelId).display_name;
    } catch (err) {

    }

    return output;
}

exports.getColor = (channelId) => {
    let output = '';

    try {
        output = channelList.find(item => item.channel_id == channelId).color;
    } catch (err) {

    }

    return output;
}

exports.getLang = (channelId) => {
    let output = '';

    try {
        output = channelList.find(item => item.channel_id == channelId).lang;
    } catch (err) {

    }

    return output;
}