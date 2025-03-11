const fs = require('node:fs');

const config = {
    owner: ["6285895789545"],
    name: "ʀuᴅᴀʟ ᴘᴇʀκᴀsᴀ",
    ownername: 'ғιɴɴ', 
    ownername2: 'xvʏɴɴ',
    prefix: [".", "?", "!", "/", "#"], //Tambahin sendiri prefix nya kalo kurang
    wwagc: 'https://chat.whatsapp.com/JyeT1hdCPJeLy95tzx5eyI',
    saluran: '120363279195205552@newsletter', 
    jidgroupnotif: '120363266755712733@g.us', 
    saluran2: '120363335701540699@newsletter', 
    jidgroup: '120363267102694949@g.us', 
    wach: 'https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W', 
    sessions: "sessions",
    link: {
     tt: "https://www.tiktok.com/@finn.ofc_"
    },
    sticker: {
      packname: "〆 ʀuᴅᴀʟ ᴘᴇʀκᴀsᴀ",
      author: "ʙʏ: ғιɴɴ/xvʏɴɴ 〆"
    },
   messages: {
      wait: "*( Loading )* Tunggu Sebentar...",
      owner: "*( Denied )* Kamu bukan owner ku !",
      premium: "*( Denied )* Fitur ini khusus user premium",
      group: "*( Denied )* Fitur ini khusus group",
      botAdmin: "*( Denied )* Lu siapa bukan Admin group",
      grootbotbup: "*( Denied )* Jadiin Yuta-Botz admin dulu baru bisa akses",
   },
   database: "hanako-db",
   tz: "Asia/Jakarta"
}

module.exports = config

let file = require.resolve(__filename);
fs.watchFile(file, () => {
   fs.unwatchFile(file);
  delete require.cache[file];
});
