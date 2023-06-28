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
];
const productNameType = [
    "web app",
    "app",
    "web service",
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

const locations = [
    "https://github.com/bcgov/design-system",
    "https://github.com/bcgov/BC-Policy-Framework-For-GitHub",
    "https://github.com/bcgov/api-guidelines",
    "https://github.com/bcgov/digital-principles"

]

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
        getRandomItem(productNameType);

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
    let location = getRandomItem(locations);

    let newProduct = {
        productId,
        productName,
        productOwnerName,
        developers: developersList,
        scrumMasterName,
        startDate,
        methodology,
        location
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
