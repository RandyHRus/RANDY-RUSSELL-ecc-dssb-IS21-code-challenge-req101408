import React from "react";

export default interface Product {
    productId: string;
    productName: string;
    productOwnerName: string;
    developers: string[];
    startDate: string;
    scrumMasterName: string;
    methodology: string;
}
