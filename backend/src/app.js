const express = require('express');
const dataAccess = require('./dataAccess');

const app = express();
const port = 3000;


const apiRouter = express.Router(); // route for /api
app.use('/api', apiRouter);

// middleware to load data into memory.
apiRouter.use((req, res, next) => {
    dataAccess.loadProductsFromFile();
    next();
});

// Get all products
apiRouter.get('/products', (req, res) => {
    let products = dataAccess.getAllProducts();
    res.send(products);
});

// Get one product using product ID
apiRouter.get('/product/:productId', (req, res) => {
    let product = dataAccess.getProduct(req.params.productId);
    res.send(product);
});
  
// POST method route
apiRouter.post('/', (req, res) => {
    res.send('POST request');
});

// PUT method route
apiRouter.put('/', (req, res) => {
    res.send('PUT request');
});

// DELETE method route
apiRouter.delete('/', (req, res) => {
    res.send('DELETE request');
});


module.exports = app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});