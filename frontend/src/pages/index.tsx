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
import AddProductDialog from "@/components/addProductDialog";
import { readProducts } from "../apiAccess";
import { displayError } from "@/components/errorDisplay";

interface Column {
    id: string;
    label: string;
    minWidth?: number;
}

const dialogIDs = {
    addProductDialog: 0,
    editProductDialog: 1,
};

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [dialogOpen, setDialogOpen] = React.useState(-1);

    function handleDialogClose() {
        setDialogOpen(-1);
        refreshProducts();
    }

    function handleDialogOpen(dialogID: number) {
        setDialogOpen(dialogID);
    }

    function refreshProducts() {
        console.log("refreshing products.");
        readProducts()
            .then((products: Product[]) => {
                setProducts(products);
            })
            .catch((err: string) => {
                displayError(err);
            });
    }

    useEffect(() => {
        refreshProducts();
    }, []); // [] means this effect will only run on component mount.

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
                <div className={styles["menu-bar-wrapper"]}>
                    <Button
                        variant="contained"
                        onClick={() =>
                            handleDialogOpen(dialogIDs.addProductDialog)
                        }
                    >
                        Add product
                    </Button>
                </div>
                <div className={styles["products-table-wrapper"]}>
                    <ProductsTable products={products} />
                </div>
                <AddProductDialog
                    open={dialogOpen == dialogIDs.addProductDialog}
                    handleClose={handleDialogClose}
                />
            </main>
        </>
    );
}
