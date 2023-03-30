import { Request, Response, NextFunction } from "express";

const dataAccess = require("./dataAccess");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const apiRouter = express.Router(); // route for /api
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //parse request body
app.use(cors()); // enable cross-origin requests
app.use("/api", apiRouter);

// middleware to load data into memory.
apiRouter.use((req: Request, res: Response, next: NextFunction) => {
    console.log("loading products into memory");
    dataAccess.loadProductsFromFile();
    next();
});

apiRouter.use((req: Request, res: Response, next: NextFunction) => {
    console.log("Received request");
    console.log("params: " + JSON.stringify(req.params));
    console.log("body: " + JSON.stringify(req.body));
    next();
});

// Get all products
apiRouter.get("/products", (req: Request, res: Response) => {
    try {
        let products = dataAccess.getAllProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send(JSON.parse((error as Error).message));
    }
});

// Get one product using product ID
apiRouter.get("/product/:productId", (req: Request, res: Response) => {
    try {
        let product = dataAccess.getProduct(req.params.productId);
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

// POST method route
apiRouter.post("/product", (req: Request, res: Response) => {
    try {
        let product = dataAccess.postProduct(req.body);
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(JSON.parse((error as Error).message));
    }
});

// PUT method route
apiRouter.put("/", (req: Request, res: Response) => {
    res.send("PUT request");
});

// DELETE method route
apiRouter.delete("/", (req: Request, res: Response) => {
    res.send("DELETE request");
});

module.exports = app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
