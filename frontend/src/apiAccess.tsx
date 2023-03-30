import React from "react";
import Product from "./product";

const apiURL = "http://localhost:3000/api";

/**
 * Send POST request to create product
 * @param {Product} product
 * @returns {Promise<Product | object>}
 *      resulting product on success
 *      error object on fail
 */
export function createProduct(product: Product): Promise<Product | object> {
    return new Promise((resolve, reject) => {
        let responseType: string;
        fetch(apiURL + "/product", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        })
            .then((response) => {
                if (!response.ok) {
                    responseType = "error";
                } else {
                    responseType = "product";
                }
                return response.json();
            })
            .then((json) => {
                if (responseType == "product") {
                    console.log("successfully created product");
                    return resolve(json);
                } else {
                    console.log("Failed to create product");
                    return reject(json);
                }
            })
            .catch((error) => {
                console.log("Failed to create product");
                return reject(error);
            });
    });
}

export function readProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
        fetch(apiURL + "/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to read products");
                }
                return response.json();
            })
            .then((products: Product[]) => {
                console.log("retrieved products");
                return resolve(products);
            })
            .catch((error) => {
                console.log("Failed to read products");
                return reject(error);
            });
    });
}
