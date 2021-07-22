"use strict";
const fetch = require("node-fetch");
const client = require("../db");

module.exports = function (app) {
  app.route("/api/stock-prices").get(async function (req, res) {
    const symbol = req.query.stock;
    const like = req.query.like;
    const conn = await client.connect();
    const ips = conn.db("Main").collection("IP Addresses");
    const likes = conn.db("Main").collection("Likes");
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const ipExists = await ips.findOne({ ip: ip });

    if (like === "true" && !ipExists) {
      await ips.insertOne({
        ip: ip,
      });
    }
    if (typeof symbol == "string") {
      const body = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`);
      const json = await body.json();
      if (like === "true" && !ipExists) {
        await likes.findOneAndUpdate({ symbol: json.symbol }, { $inc: { total: 1 } }, { upsert: true });
      }
      const doc = await likes.findOne({ symbol: json.symbol });

      res.json({
        stockData: {
          stock: json.symbol,
          price: json.latestPrice,
          likes: doc?.total || 0,
        },
      });
    } else {
      const result = [];
      const likesValues = [];
      for (let i = 0; i < symbol.length; i++) {
        const body = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol[i]}/quote`);
        const json = await body.json();
        if (like === "true" && !ipExists) {
          await likes.findOneAndUpdate({ symbol: json.symbol }, { $inc: { total: 1 } }, { upsert: true });
        }
        const doc = await likes.findOne({ symbol: json.symbol });
        likesValues.push(doc?.total || 0);
        result.push({
          stock: json.symbol,
          price: json.latestPrice,
          rel_likes: 0,
        });
      }

      result[0].rel_likes = likesValues[0] - likesValues[1];
      result[1].rel_likes = likesValues[1] - likesValues[0];
      res.json({
        stockData: result,
      });
    }
  });
};
