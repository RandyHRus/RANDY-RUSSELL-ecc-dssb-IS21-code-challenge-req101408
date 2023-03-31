import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
    Select,
    MenuItem,
    InputLabel,
    SelectChangeEvent,
    FormControl,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import Product from "@/product";
import { createProduct, updateProduct } from "@/apiAccess";
import { displayError } from "./errorDisplay";

export default function EditProductDialog(props: {
    open: boolean;
    product: Product | null;
    handleClose: () => void;
}) {
    const [productName, setProductName] = useState<string>("");
    const [scrumMasterName, setScrumMasterName] = useState<string>("");
    const [productOwnerName, setProductOwnerName] = useState<string>("");
    const [developers, setDevelopers] = useState<string>("");
    const [methodology, setMethodology] = useState<string>("");

    const [productNameErr, setProductNameErr] = useState<string>("");
    const [scrumMasterErr, setScrumMasterErr] = useState<string>("");
    const [productOwnerErr, setProductOwnerErr] = useState<string>("");
    const [developersErr, setDevelopersErr] = useState<string>("");
    const [methodologyErr, setMethodologyErr] = useState<string>("");

    function reset() {
        setProductName("");
        setScrumMasterName("");
        setProductOwnerName("");
        setDevelopers("");
        setMethodology("");

        setProductNameErr("");
        setScrumMasterErr("");
        setProductOwnerErr("");
        setDevelopersErr("");
        setMethodologyErr("");
    }

    useEffect(() => {
        if (props.product == null) {
            setProductName("");
            setScrumMasterName("");
            setProductOwnerName("");
            setDevelopers("");
            setMethodology("");
        } else {
            setProductName(props.product.productName);
            setScrumMasterName(props.product.scrumMasterName);
            setProductOwnerName(props.product.productOwnerName);
            setDevelopers(props.product.developers.join(", "));
            setMethodology(props.product.methodology);
        }
    }, [props.product]);

    function handleFieldChange(
        event: SelectChangeEvent,
        setFunction: (value: string) => void
    ) {
        setFunction(event.target.value as string);
    }

    function handleSubmit(): void {
        let productRequest: Product = {
            productId: props.product ? props.product.productId : -1,
            productName,
            productOwnerName,
            startDate: props.product ? props.product.startDate : "2000/01/01",
            developers: developers.split(","),
            scrumMasterName,
            methodology,
        };
        updateProduct(productRequest) //TODO
            .then((productResult) => {
                props.handleClose();
                reset();
            })
            .catch((error) => {
                displayError(error.mainMsg);
                setProductNameErr(error.productName);
                setScrumMasterErr(error.scrumMasterName);
                setProductOwnerErr(error.productOwnerName);
                setDevelopersErr(error.developers);
                setMethodologyErr(error.methodology);
            });
    }

    function handleCancel(): void {
        reset();
        props.handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>Edit product</DialogTitle>
            <DialogContent>
                <DialogContentText>Enter product details</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="productName"
                    label="Product name"
                    type="text"
                    fullWidth
                    value={productName}
                    error={productNameErr != ""}
                    helperText={productNameErr}
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(event, setProductName)
                    }
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="scrumMaster"
                    label="Scrum master"
                    type="text"
                    fullWidth
                    value={scrumMasterName}
                    error={scrumMasterErr != ""}
                    helperText={scrumMasterErr}
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(event, setScrumMasterName)
                    }
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="productOwner"
                    label="Product owner"
                    type="text"
                    fullWidth
                    value={productOwnerName}
                    error={productOwnerErr != ""}
                    helperText={productOwnerErr}
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        handleFieldChange(event, setProductOwnerName);
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="developers"
                    label="developers (separate by comma)"
                    type="text"
                    fullWidth
                    value={developers}
                    error={developersErr != ""}
                    helperText={developersErr}
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(event, setDevelopers)
                    }
                />
                <FormControl fullWidth>
                    <InputLabel>{"Methodology"}</InputLabel>
                    <Select
                        labelId="methodology"
                        id="methodology"
                        value={methodology}
                        label="Methodology"
                        variant="standard"
                        fullWidth
                        error={methodologyErr != ""}
                        onChange={(event: SelectChangeEvent) =>
                            handleFieldChange(event, setMethodology)
                        }
                    >
                        <MenuItem value={"agile"}>Agile</MenuItem>
                        <MenuItem value={"waterfall"}>Waterfall</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
