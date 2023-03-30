import ProductError from "./productError";
import Product from "./util/product";

/**
 * Script for accessing data.
 */

const fs = require("fs");
const path = require("path");

const inMemoryDataDict: Record<number, Product> = {};

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
        let res = fs.readFileSync(dataFilePath);
        let data = JSON.parse(res);
        for (let i = 0; i < data.length; i++) {
            let product: Product = data[i];
            let productId: number = product.productId;
            inMemoryDataDict[productId] = product;
        }
    } catch (e) {
        console.error(e);
        console.error(
            "something went wrong reading data file. Make sure data follows correct syntax."
        );
    }
}

/**
 * Retrieves all products stored in memory.
 * @param none
 * @returns {Product[]} list of products
 */
function getAllProducts() {
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
        mainMsg: "",
        productName: "",
        productOwnerName: "",
        developers: "",
        startDate: "",
        scrumMasterName: "",
        methodology: "",
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
        let newProductId = product.productId
            ? product.productId
            : generateNewID();
        let newProduct: Product = {
            productId: newProductId,
            productName: product.productName,
            productOwnerName: product.productOwnerName,
            developers: product.developers,
            scrumMasterName: product.scrumMasterName,
            startDate: product.startDate,
            methodology: product.methodology,
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
 * @returns {Product} product
 */
function putProduct(product: Product) {
    let oProductError = verifyProduct(product);

    if (oProductError != null) {
        console.log("Invalid product");
        throw new Error(JSON.stringify(oProductError));
    }

    let existingProduct = inMemoryDataDict[product.productId];

    let newProduct: Product = {
        productId: product.productId,
        productName: product.productName,
        productOwnerName: product.productOwnerName,
        developers: product.developers,
        scrumMasterName: product.scrumMasterName,
        startDate: product.startDate,
        methodology: product.methodology,
    };

    try {
        postProduct(product);
    } catch (error) {
        console.log("could not edit product");
        throw error;
    }
}

/**
 * Retrieves one product
 * @param {number} productId
 * @returns {Product} product
 */
function getProduct(productId: number) {
    return inMemoryDataDict[productId];
}

/**
 * Generates new ID that does not conflict with existing ones
 * @returns {number} int
 */
function generateNewID() {
    //TODO: come up with better way to generate this
    return Math.ceil(Math.random() * 100000000);
}

module.exports = {
    loadProductsFromFile: loadProductsFromFile,
    getAllProducts: getAllProducts,
    getProduct: getProduct,
    postProduct: postProduct,
};
