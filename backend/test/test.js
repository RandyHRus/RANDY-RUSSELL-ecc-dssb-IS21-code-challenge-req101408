const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);

const dataFilePath = path.join(__dirname, "..", "productsData.json");

describe('Test dataAccess.js', function() {
  it('should get all products', function(done) {
    let res = fs.readFileSync(dataFilePath);
    let dataFromFile = JSON.parse(res);

    chai.request(app)
      .get('/api/products')
      .end(function(err, res) {
        assert.equal(null, err);
        assert.equal(200, res.status);

        let dataFromRequest = res.body;
        assert.equal(dataFromRequest.length, dataFromFile.length);

        // Make sure that data retrieved from request is same as what is in file.
        assert.deepEqual(dataFromFile, dataFromRequest);
        done();
      });
  });

  it('should get one product', function(done) {
    let res = fs.readFileSync(dataFilePath);
    let dataFromFile = JSON.parse(res);

    let product1 = dataFromFile[0];

    chai.request(app)
      .get(`/api/product/${product1.productId}`)
      .end(function(err, res) {
        assert.equal(null, err);
        assert.equal(200, res.status);

        let dataFromRequest = res.body;
        assert.deepEqual(product1, dataFromRequest);
        done();
      });
  });
});