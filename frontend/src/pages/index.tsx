import Head from "next/head";
import styles from "@/styles/Home.module.css";
import {
    Button,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ProductsTable from "../components/productsTable";
import Product from "../product";

const apiURL = "http://localhost:3000";

interface Column {
    id: string;
    label: string;
    minWidth?: number;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                console.log("fetching products");
                const response = await fetch(apiURL + "/api/products");
                const responseJson = await response.json();
                setProducts(responseJson);
            } catch (error) {
                console.error("error getting products");
            }
        }
        fetchProducts();
    }, []); // [] means this effect will only run on component mount.

    const columns: readonly Column[] = [
        { id: "productId", label: "Product number (ID)", minWidth: 170 },
        { id: "productName", label: "Product name", minWidth: 100 },
        { id: "scrumMasterName", label: "Scrum master", minWidth: 100 },
        { id: "productOwnerName", label: "Product owner", minWidth: 100 },
        { id: "developers", label: "Developers", minWidth: 100 },
        { id: "startDate", label: "Start date", minWidth: 100 },
        { id: "methodology", label: "Methodology", minWidth: 100 },
    ];

    return (
        <>
            <Head>
                <title>Product manager</title>
                <meta name="description" content="Product manager" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <ProductsTable products={products} />
            </main>
        </>
    );
}
