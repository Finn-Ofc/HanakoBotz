// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// Scraper SaveTube
// By: Daffa
// Link Scraper: https://whatsapp.com/channel/0029Vb5EZCjIiRotHCI1213L/121

// Remake: Leooxzy
// Bio cr: Krz

const axios = require('axios');
const crypto = require('crypto');

// Api
const api = {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
}

// headers
const headers = {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
}

// crypto
const cryptoo = {
    hexToBuffer: (hexString) => {
        const matches = hexString.match(/.{1,2}/g);
        return Buffer.from(matches.join(''), 'hex');
    }
}

// formats
const formats = ['144', '240', '360', '480', '720', '1080', 'mp3']

// Scraper
async function SaveTube(link, format = '720') {
    const decrypt = async (enc) => {
        try {
            const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
            const data = Buffer.from(enc, 'base64');
            const iv = data.slice(0, 16);
            const content = data.slice(16);
            const key = cryptoo.hexToBuffer(secretKey);

            const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
            let decrypted = decipher.update(content);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return JSON.parse(decrypted.toString());
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    const isUrl = str => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    }

    const youtube = url => {
        if (!url) return null;
        const a = [
            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
            /youtu\.be\/([a-zA-Z0-9_-]{11})/
        ];
        for (let b of a) {
            if (b.test(url)) return url.match(b)[1];
        }
        return null;
    }

    const request = async (endpoint, data = {}, method = 'post') => {
        try {
            const {
                data: response
            } = await axios({
                method,
                url: `${endpoint.startsWith('http') ? '' : api.base}${endpoint}`,
                data: method === 'post' ? data : undefined,
                params: method === 'get' ? data : undefined,
                headers: headers
            });
            return {
                status: true,
                code: 200,
                data: response
            };
        } catch (error) {
            return {
                status: false,
                code: error.response?.status || 500,
                error: error.message
            };
        }
    }

    const getCDN = async () => {
        const response = await request(api.cdn, {}, 'get');
        if (!response.status) return response;
        return {
            status: true,
            code: 200,
            data: response.data.cdn
        };
    }

    if (!link) {
        return {
            status: false,
            code: 400,
            error: "Linknya mana? Yakali download kagak ada linknya 🗿"
        };
    }

    if (!isUrl(link)) {
        return {
            status: false,
            code: 400,
            error: "Lu masukin link apaan sih 🗿 Link Youtube aja bree, kan lu mau download youtube 👍🏻"
        };
    }

    if (!format || !formats.includes(format)) {
        return {
            status: false,
            code: 400,
            error: "Formatnya kagak ada bree, pilih yang udah disediain aja yak, jangan nyari yang gak ada 🗿",
            available_fmt: savetube.formats
        };
    }

    const id = youtube(link);
    if (!id) {
        return {
            status: false,
            code: 400,
            error: "Kagak bisa ekstrak link youtubenya nih, btw link youtubenya yang bener yak.. biar kagak kejadian begini lagi 😂"
        };
    }

    try {
        const cdnx = await getCDN();
        if (!cdnx.status) return cdnx;
        const cdn = cdnx.data;

        const result = await request(`https://${cdn}${api.info}`, {
            url: `https://www.youtube.com/watch?v=${id}`
        });
        if (!result.status) return result;
        const decrypted = await decrypt(result.data.data);

        const dl = await request(`https://${cdn}${api.download}`, {
            id: id,
            downloadType: format === 'mp3' ? 'audio' : 'video',
            quality: format === 'mp3' ? '128' : format,
            key: decrypted.key
        });

        return {
            status: true,
            code: 200,
            result: {
                title: decrypted.title || "Gak tau 🤷🏻",
                type: format === 'mp3' ? 'audio' : 'video',
                format: format,
                thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                download: dl.data.data.downloadUrl,
                id: id,
                key: decrypted.key,
                duration: decrypted.duration,
                quality: format === 'mp3' ? '128' : format,
                downloaded: dl.data.data.downloaded || false
            }
        };

    } catch (error) {
        return {
            status: false,
            code: 500,
            error: error.message
        };
    }
};

module.exports = SaveTube
