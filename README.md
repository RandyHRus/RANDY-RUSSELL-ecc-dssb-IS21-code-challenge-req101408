# Instructions on how to run this on a development machine.

## 1. Setup and run backend.

Navigate to folder /backend and run these commands

```
npm install
```

```
npm run dev
```

the app will start on port 3000.

## 2. Setup and run frontend

In a separate terminal, navigate to folder /frontend and run these commands

```
npm install
```

```
npm run dev
```

The app will start on port 3001, (or the next available port if 3001 is already in use).
Navigate to localhost:3001 in your browser to access the app.

# Available features

All requested features are implemented.

### Backend

-   Backend was built using Node.js with Express.js
-   The products data is stored in productsData.json.
-   REST API is used to get/create/update/delete products from productsData.json.
-   The API includes a healthcheck end point at localhost:3000/api/healthcheck
-   For more information on the API, swagger API document can be found on localhost:3000/api/api-docs

### Frontend

-   Frontend was built using Next.js (React.js).
-   The frontend utilizes the api to get/create/update/delete products.

### User story 1

-   When you navigate to localhost:3001, you should be able to see a list of all products stored on the server.
-   Total number of products should be displayed on bottom right
-   Use left/right arrows on bottom right to navigate between pages.

### User story 2

-   When you navigate to localhost:3001, you should see an "add product" button on the top right.
-   Form will be displayed to fill in product information
-   If you try to save a product with invalid fields, you will be notified with an error
-   If all form fields are filled in correctly and you hit "save", the new product will be added to the server, and changes will be displayed immediately

### User story 3

-   At the right most column of every row, there exists an "edit" button to edit that product
-   Form will be displayed to fill in product information
-   If you try to save a product with invalid fields, you will be notified with an error
-   If all form fields are filled in correctly and you hit "save", the product will be updated in the server, and changes will be displayed immediately
