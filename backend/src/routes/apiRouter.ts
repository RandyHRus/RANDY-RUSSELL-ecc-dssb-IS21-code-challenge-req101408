import { Request, Response, NextFunction } from "express";

const dataAccess = require("../dataAccess");
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerDocs = require("./swagger.json");

const apiRouter = express.Router();

apiRouter.use(bodyParser.json()); //parse request body
apiRouter.use(cors()); // enable cross-origin requests
apiRouter.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// middleware to load data into memory.
apiRouter.use((req: Request, res: Response, next: NextFunction) => {
    console.log("loading products into memory");
    dataAccess.loadProductsFromFile();
    next();
});

// middleware to display request information
apiRouter.use((req: Request, res: Response, next: NextFunction) => {
    console.log("Received request");
    console.log("params: " + JSON.stringify(req.params));
    console.log("body: " + JSON.stringify(req.body));
    next();
});

apiRouter.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).send("healthy");
});

apiRouter.get("/products", (req: Request, res: Response) => {
    try {
        let products = dataAccess.getAllProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send({ error: (error as Error).message });
    }
});

// Get one product using productId
apiRouter.get("/product/:productId", (req: Request, res: Response) => {
    try {
        let product = dataAccess.getProduct(req.params.productId);
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send({ error: (error as Error).message });
    }
});

// Post one new product
apiRouter.post("/product", (req: Request, res: Response) => {
    try {
        let product = dataAccess.postProduct(req.body);
        res.status(200).send(product);
    } catch (error) {
        try {
            let parse = JSON.parse((error as Error).message);
            res.status(400).send(parse);
        } catch (error2) {
            res.status(400).send({ error: (error as Error).message });
        }
    }
});

// Put one product
apiRouter.put("/product", (req: Request, res: Response) => {
    try {
        let product = dataAccess.putProduct(req.body);
        res.status(200).send(product);
    } catch (error) {
        try {
            let parse = JSON.parse((error as Error).message);
            res.status(400).send(parse);
        } catch (error2) {
            res.status(400).send({ error: (error as Error).message });
        }
    }
});

// Delete one product using productId
apiRouter.delete("/product/:productId", (req: Request, res: Response) => {
    try {
        dataAccess.deleteProduct(req.params.productId);
        res.status(200).send(req.params.productId);
    } catch (error) {
        res.status(400).send({ error: (error as Error).message });
    }
});

module.exports = apiRouter;
