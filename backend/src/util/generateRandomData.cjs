/**
 * Script used to generate random product data
 * run using "node generateRandomData.js"
 * it will generate or override data.json file in current directory
 */
const fs = require("fs");

let count = 40;

const productNamePrefix = [
    "Cool",
    "Useful",
    "Fun",
    "top secret",
];
const productNameType = [
    "web app",
    "microservice",
    "management app",
    "web service",
];
const productNameAudience = [
    "citizens",
    "government officials",
    "people",
    "employees",
];
const productNamePurpose = [
    "helping people",
    "increasing productivity",
    "managing business",
    "educating",
    "communication",
    "time management"
];

const firstNames = [
    "Fatima",
    "Kai",
    "Ayaan",
    "Amara",
    "Jamal",
    "Sofia",
    "Nabil",
    "Carmen",
    "Yara",
    "Dante",
];
const lastNames = [
    "Patel",
    "Nguyen",
    "Rodriguez",
    "Kim",
    "Johnson",
    "Singh",
    "Wong",
    "Martinez",
    "Lee",
    "Gomez",
];

const methodologies = ["agile", "waterfall"];

function generateRandomName() {
    return getRandomItem(firstNames) + " " + getRandomItem(lastNames);
}

function getRandomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

let result = [];

for (let i = 0; i < count; i++) {
    let productId = i;
    let productName =
        getRandomItem(productNamePrefix) + " " +
        getRandomItem(productNameType) +
        " used by " +
        getRandomItem(productNameAudience) + " for " +
        getRandomItem(productNamePurpose);

    let productOwnerName = generateRandomName();

    let developersList = [];
    let developersCount = Math.ceil(Math.random() * 5);
    for (let i = 0; i < developersCount; i++) {
        let developerName = generateRandomName();
        developersList.push(developerName);
    }

    let scrumMasterName = generateRandomName();
    let startDate = "2023/03/25";
    let methodology = getRandomItem(methodologies);

    let newProduct = {
        productId,
        productName,
        productOwnerName,
        developers: developersList,
        scrumMasterName,
        startDate,
        methodology,
    };

    result.push(newProduct);
}

fs.writeFile("productsData.json", JSON.stringify(result, null, 2), (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log("data generated");
    }
});
