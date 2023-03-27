/** 
 * Script for accessing data.
 */

const fs = require('fs');
const path = require('path');

// Hash table that stores
// Key: productID 
// value: product
const inMemoryDataDict = {};

const dataFilePath = path.join(__dirname, "..", "productsData.json");

/**
 * Function to retrieve data from file and load it into memory.
 * This function should be run before other functions.
 * @param none
 * @returns void
 */
function loadProductsFromFile() {

  try {
    let res = fs.readFileSync(dataFilePath);
    let data = JSON.parse(res);
    for (let i = 0; i < data.length; i++) {
      let product = data[i];
      let productId = product.productId;
      inMemoryDataDict[productId] = product;
    }

  } catch (e) {
    console.error(e);
    console.error("something went wrong reading data file. Make sure data follows correct syntax.");
  }
}

/**
 * Retrieves all products stored in memory.
 * @param none
 * @returns {Object[]} list of products
 */
function getAllProducts() {
  return Object.values(inMemoryDataDict);
}

/**
 * Retrieves one product 
 * @param {string} productId
 * @returns {Object} product object
 */
function getProduct(productId) {
  return inMemoryDataDict[productId];
}

module.exports = {
  loadProductsFromFile: loadProductsFromFile,
  getAllProducts: getAllProducts,
  getProduct: getProduct,
}