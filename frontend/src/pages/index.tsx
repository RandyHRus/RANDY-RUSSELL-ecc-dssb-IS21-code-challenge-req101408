import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProductsTable from "../components/productsTable";
import Product from "../product";
import AddProductDialog from "@/components/addProductDialog";
import { readProducts } from "../apiAccess";
import EditProductDialog from "@/components/editProductDialog";

const DIALOG_IDS = {
    addProductDialog: 0,
    editProductDialog: 1,
};

export default function Home() {
    //All products found in the app.
    const [products, setProducts] = useState<Product[]>([]);

    const [dialogOpen, setDialogOpen] = React.useState(-1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [errorMsg, setErrorMsg] = useState<string>("");

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
            .catch((err: Error) => {
                setErrorMsg(err.message);
            });
    }

    function handleErrorClose() {
        setErrorMsg("");
    }

    // Fetch products on mount.
    useEffect(() => {
        refreshProducts();
    }, []);

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
            <main className={styles.main} style={{ minWidth: "1000px" }}>
                <div className={styles["menu-bar-wrapper"]}>
                    <Button
                        variant="contained"
                        className={styles["menu-bar-item"]}
                        onClick={() =>
                            handleDialogOpen(DIALOG_IDS.addProductDialog)
                        }
                    >
                        Add product
                    </Button>
                </div>
                <div className={styles["products-table-wrapper"]}>
                    <ProductsTable
                        products={products}
                        handleEditDialogOpen={function (product: Product) {
                            setSelectedProduct(product);
                            setDialogOpen(DIALOG_IDS.editProductDialog);
                        }}
                    />
                </div>
                <AddProductDialog
                    open={dialogOpen == DIALOG_IDS.addProductDialog}
                    displayError={setErrorMsg}
                    handleClose={handleDialogClose}
                />
                <EditProductDialog
                    open={dialogOpen == DIALOG_IDS.editProductDialog}
                    product={selectedProduct}
                    displayError={setErrorMsg}
                    handleClose={handleDialogClose}
                />
                <Snackbar
                    open={errorMsg != ""}
                    autoHideDuration={3000}
                    onClose={handleErrorClose}
                >
                    <Alert severity="error">{errorMsg}</Alert>
                </Snackbar>
            </main>
        </>
    );
}
