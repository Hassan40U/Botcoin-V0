const axios = require("axios");

const fs = require("fs-extra");

const path = require("path");

const KievRPSSecAuth = "1SoFg6cwhu8Zvthfd4-CDn61FDt06rwf7RlwAukrUTbhdJSgb7RTQjo79XOPsQQtmKBokLM7UQAxA8-h6Gl6WZxQKSpAscZ4ZeWlDiOdZgcryO2P1byG93OuSH21NYScW3dvWL7riNwThZKqhwyCegmFrwzv-qrNkv4LP82drOefaaL7zMl2FiflvONhIwo7-8SpHTu4MxItf-XveY9ebTA8VY7kOCc4WGCmPkpdefAU";

const _U = "1SoFg6cwhu8Zvthfd4-CDn61FDt06rwf7RlwAukrUTbhdJSgb7RTQjo79XOPsQQtmKBokLM7UQAxA8-h6Gl6WZxQKSpAscZ4ZeWlDiOdZgcryO2P1byG93OuSH21NYScW3dvWL7riNwThZKqhwyCegmFrwzv-qrNkv4LP82drOefaaL7zMl2FiflvONhIwo7-8SpHTu4MxItf-XveY9ebTA8VY7kOCc4WGCmPkpdefAU";



module.exports = {

  config: {

    name: "dalle",

    version: "1.0.2",

    author: "Samir Œ ",

    role: 0,

    countDown: 5,

    shortDescription: { en: "dalle3 image generator" },

    longDescription: { en: "dalle3 is a image generator powdered by OpenAi" },

    category: "𝗔𝗜",

    guide: { en: "{prefix}dalle <search query>" }

  },



  onStart: async function ({ api, event, args }) {

    const prompt = args.join(" ");



    try {

      const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(prompt)}`);

      const data = res.data.results.images;



      if (!data || data.length === 0) {

        api.sendMessage("response received but imgurl are missing ", event.threadID, event.messageID);

        return;

      }



      const imgData = [];



      for (let i = 0; i < Math.min(4, data.length); i++) {

        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });

        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);

        await fs.outputFile(imgPath, imgResponse.data);

        imgData.push(fs.createReadStream(imgPath));

      }



      await api.sendMessage({

        attachment: imgData,

        body: `Here's your generated image`

      }, event.threadID, event.messageID);



    } catch (error) {

      api.sendMessage("Can't Full Fill this request ", event.threadID, event.messageID);

    }

  }

}
