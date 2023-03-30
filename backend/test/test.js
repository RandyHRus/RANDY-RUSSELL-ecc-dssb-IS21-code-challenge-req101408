const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);

const dataFilePath = path.join(__dirname, "..", "productsData.json");

describe('Test dataAccess.js', function() {
  describe('Test GET', function() {
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

    it('Should get one product', function(done) {
      let res = fs.readFileSync(dataFilePath);
      let dataFromFile = JSON.parse(res);

      let product1 = dataFromFile[0];

      chai.request(app)
        .get(`/api/product/${product1.productId}`)
        .end(function(err, res) {
          assert.equal(null, err);
          assert.equal(200, res.status);

          let dataFromRequest = res.body;
          assert.deepEqual(dataFromRequest, product1);
          done();
        });
    });
  });


  describe('Test POST', function() {
    it('Should create one product', function(done) {

      let requestProduct = {
        productId: 100,
        productName: "test product",
        productOwnerName: "John Doe",
        developers: ["Bob", "Dog"],
        startDate: "2000/01/01",
        scrumMasterName: "John Doe 2",
        methodology: "agile",
      }

      let expectProduct = {
        productId: null,
        productName: "test product",
        productOwnerName: "John Doe",
        developers: ["Bob", "Dog"],
        startDate: "2000/01/01",
        scrumMasterName: "John Doe 2",
        methodology: "agile",
      }

      chai.request(app)
        .post("/api/product/")
        .send(requestProduct)
        .end(function(err, res) {
          assert.equal(null, err);
          assert.equal(200, res.status);

          let resultProduct = res.body;
          expectProduct.productId = resultProduct.productId;
          assert.deepEqual(resultProduct, expectProduct);
          done();
        });
    });
  });

  it('Should have error in product name', function(done) {

    let requestProduct = {
      productId: 100,
      productName: "",
      productOwnerName: "John Doe",
      developers: ["Bob", "Dog"],
      startDate: "2000/01/01",
      scrumMasterName: "John Doe 2",
      methodology: "agile",
    }

    let expectedError = {
        mainMsg:"",
        productName:"Invalid product name",
        productOwnerName:"",
        developers:"",
        startDate:"",
        scrumMasterName:"",
        methodology:""
      }

    chai.request(app)
      .post("/api/product/")
      .send(requestProduct)
      .end(function(err, res) {
        assert.equal(null, err);
        assert.equal(400, res.status);
        assert.deepEqual(res.body, expectedError);
        done();
      });
  });

  it('Should have error in multiple fields', function(done) {

    let requestProduct = {
      productId: 100,
      productName: "",
      productOwnerName: "",
      developers: ["", "Dog"],
      startDate: "",
      scrumMasterName: "",
      methodology: "",
    }

    let expectedError = {
        mainMsg:"",
        productName:"Invalid product name",
        productOwnerName:"Invalid product owner name",
        developers:"At least 1 of developer names is invalid",
        startDate:"Invalid start date",
        scrumMasterName:"Invalid scrum master name",
        methodology:"Invalid methodology"
      }

    chai.request(app)
      .post("/api/product/")
      .send(requestProduct)
      .end(function(err, res) {
        assert.equal(null, err);
        assert.equal(400, res.status);
        assert.deepEqual(res.body, expectedError);
        done();
      });
  });

  it('Should return too many developers', function(done) {

    let requestProduct = {
      productId: 100,
      productName: "",
      productOwnerName: "",
      developers: ["ee", "Dog", "test", "bob", "1", "3"],
      startDate: "",
      scrumMasterName: "",
      methodology: "",
    }

    let expectedError = {
        mainMsg:"",
        productName:"Invalid product name",
        productOwnerName:"Invalid product owner name",
        developers:"Too many developers. Max:5",
        startDate:"Invalid start date",
        scrumMasterName:"Invalid scrum master name",
        methodology:"Invalid methodology"
      }

    chai.request(app)
      .post("/api/product/")
      .send(requestProduct)
      .end(function(err, res) {
        assert.equal(null, err);
        assert.equal(400, res.status);
        assert.deepEqual(res.body, expectedError);
        done();
      });
  });
});