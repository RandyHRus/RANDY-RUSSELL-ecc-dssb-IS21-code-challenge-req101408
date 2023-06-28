import ProductError from "./productError";
import Product from "./util/product";

/**
 * Script for accessing data.
 */

const fs = require("fs");
const path = require("path");

let inMemoryDataDict: Record<number, Product> = {};

const dataFilePath = path.join(__dirname, "..", "productsData.json");

const MAX_DEVELOPERS = 5;

/**
 * Function to retrieve data from file and load it into memory.
 * This function should be run before other functions.
 * @param none
 * @returns void
 */
function loadProductsFromFile() {
    try {
        inMemoryDataDict = {};
        let res = fs.readFileSync(dataFilePath);
        let data = JSON.parse(res);
        for (let i = 0; i < data.length; i++) {
            let product: Product = data[i];
            let productId: number = product.productId;
            inMemoryDataDict[productId] = product;
        }
        console.log("loaded products into memory");
    } catch (e) {
        console.error(e);
        console.error(
            "something went wrong reading data file. Make sure data follows correct syntax."
        );
        throw e;
    }
}

/**
 * Retrieves all products stored in memory.
 * @param none
 * @returns {Product[]} list of products
 */
function getAllProducts() {
    console.log("getting products");
    return Object.entries(inMemoryDataDict).map(([key, value]) => value);
}

/**
 * Verify if product has correct signatures
 * @param none
 * @returns {object|null} error object if it contains error, null otherwise
 */
function verifyProduct(product: Product) {
    function isValidString(str: string) {
        return typeof str === "string" && str.trim().length > 0;
    }

    let oProductError: ProductError = {
        mainMsg: "Error in one of fields",
        productName: "",
        productOwnerName: "",
        developers: "",
        startDate: "",
        scrumMasterName: "",
        methodology: "",
        location: "",
    };

    if (!product) {
        oProductError.mainMsg = "Product cannot be empty.";
        throw new Error(JSON.stringify(oProductError));
    }

    let bProductContainsError: boolean = false;

    if (!isValidString(product.productName)) {
        bProductContainsError = true;
        oProductError.productName = "Invalid product name";
    }

    if (!isValidString(product.productOwnerName)) {
        bProductContainsError = true;
        oProductError.productOwnerName = "Invalid product owner name";
    }

    if (Array.isArray(product.developers)) {
        if (product.developers.length > MAX_DEVELOPERS) {
            oProductError.developers =
                "Too many developers. Max:" + MAX_DEVELOPERS.toString();
            bProductContainsError = true;
        }
        for (let i = 0; i < product.developers.length; i++) {
            if (!isValidString(product.developers[i])) {
                oProductError.developers =
                    "At least 1 of developer names is invalid";
                bProductContainsError = true;
                break;
            }
        }
    } else {
        oProductError.developers = "Developers needs to be an array";
        bProductContainsError = true;
    }

    if (isNaN(Date.parse(product.startDate))) {
        oProductError.startDate = "Invalid start date";
        bProductContainsError = true;
    }

    if (!isValidString(product.scrumMasterName)) {
        oProductError.scrumMasterName = "Invalid scrum master name";
        bProductContainsError = true;
    }

    if (
        !isValidString(product.methodology) ||
        (product.methodology != "agile" && product.methodology != "waterfall")
    ) {
        oProductError.methodology = "Invalid methodology";
        bProductContainsError = true;
    }

    if (!isValidString(product.location)) {
        oProductError.location = "Invalid location";
        bProductContainsError = true;
    }

    if (bProductContainsError) {
        return oProductError;
    } else {
        return null;
    }
}

/**
 * Adds new product into memory and storage (JSON file)
 * @param {Product} product
 * @returns {Product} product
 * @throws {Error} if product is invalid
 */
function postProduct(product: Product) {
    let oProductError = verifyProduct(product);

    if (oProductError != null) {
        console.log("Invalid product");
        throw new Error(JSON.stringify(oProductError));
    }

    try {
        let newProductId =
            product.productId != -1 ? product.productId : generateNewID();
        let newProduct: Product = {
            productId: newProductId,
            productName: product.productName,
            productOwnerName: product.productOwnerName,
            developers: product.developers,
            scrumMasterName: product.scrumMasterName,
            startDate: product.startDate,
            methodology: product.methodology,
            location: product.location,
        };

        inMemoryDataDict[newProductId] = newProduct;

        fs.writeFileSync(
            dataFilePath,
            JSON.stringify(Object.values(inMemoryDataDict), null, 2)
        );

        return newProduct;
    } catch (error) {
        console.log("could not create product");
        throw error;
    }
}

/**
 * Edits one product
 * @param {number} productId
 * @returns {Product} the edited product
 */
function putProduct(product: Product) {
    let oProductError = verifyProduct(product);

    if (oProductError != null) {
        console.log("Invalid product");
        throw new Error(JSON.stringify(oProductError));
    }

    inMemoryDataDict[product.productId];

    let newProduct: Product = {
        productId: product.productId,
        productName: product.productName,
        productOwnerName: product.productOwnerName,
        developers: product.developers,
        scrumMasterName: product.scrumMasterName,
        startDate: product.startDate,
        methodology: product.methodology,
        location: product.location,
    };

    inMemoryDataDict[product.productId] = newProduct;

    fs.writeFileSync(
        dataFilePath,
        JSON.stringify(Object.values(inMemoryDataDict), null, 2)
    );

    return newProduct;
}

/**
 * Deletes one product
 * @param {number} productId
 * @returns void
 */
function deleteProduct(productId: number) {
    if (!inMemoryDataDict[productId]) {
        throw new Error("No product with that ID");
    }

    delete inMemoryDataDict[productId];
    fs.writeFileSync(
        dataFilePath,
        JSON.stringify(Object.values(inMemoryDataDict), null, 2)
    );
}

/**
 * Retrieves one product
 * @param {number} productId
 * @returns {Product} product
 */
function getProduct(productId: number) {
    if (inMemoryDataDict[productId]) {
        return inMemoryDataDict[productId];
    } else {
        throw new Error("No product with that ID");
    }
}

/**
 * Generates new ID that does not conflict with existing ones
 * @returns {number} int
 */
function generateNewID() {
    let maxId: number = -Infinity;
    for (let [id, value] of Object.entries(inMemoryDataDict)) {
        if (value.productId > maxId) maxId = value.productId;
    }
    return maxId + 1;
}

module.exports = {
    loadProductsFromFile: loadProductsFromFile,
    getAllProducts: getAllProducts,
    getProduct: getProduct,
    postProduct: postProduct,
    putProduct: putProduct,
    deleteProduct: deleteProduct,
};
