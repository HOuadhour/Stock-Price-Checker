const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Viewing one stock: GET request to /api/stock-prices/", done => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG")
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, "application/json");
        assert.hasAnyKeys(res.body, "stockData");
        assert.strictEqual(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.likes);
        assert.isNumber(res.body.stockData.price);
      });
    done();
  });
  test("Viewing one stock and liking it: GET request to /api/stock-prices/", done => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG&like=true")
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, "application/json");
        assert.hasAnyKeys(res.body, "stockData");
        assert.strictEqual(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.likes);
        assert.isAbove(res.body.stockData.likes, 0);
        assert.isNumber(res.body.stockData.price);
      });
    done();
  });
  test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", done => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG&like=true")
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, "application/json");
        assert.hasAnyKeys(res.body, "stockData");
        assert.strictEqual(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.likes);
        assert.isNumber(res.body.stockData.price);
        assert.isAtLeast(res.body.stockData.likes, 1);
      });
    done();
  });

  test("Viewing two stocks: GET request to /api/stock-prices/", done => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG&stock=MSFT")
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, "application/json");
        assert.hasAnyKeys(res.body, "stockData");
        assert.isArray(res.body.stockData);
        assert.strictEqual(res.body.stockData.length, 2);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.isNumber(res.body.stockData[0].price);
      });
    done();
  });

  test("Viewing two stocks and liking them: GET request to /api/stock-prices/", done => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG&stock=MSFT")
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, "application/json");
        assert.hasAnyKeys(res.body, "stockData");
        assert.isArray(res.body.stockData);
        assert.strictEqual(res.body.stockData.length, 2);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.isNumber(res.body.stockData[0].price);
      });
    done();
  });
});
