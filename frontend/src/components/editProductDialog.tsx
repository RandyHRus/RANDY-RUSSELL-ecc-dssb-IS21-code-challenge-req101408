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
import { createProduct, deleteProduct, updateProduct } from "@/apiAccess";

/**
 * Pop up dialog form used to edit a product
 * @param {boolean} open, whether the form should be displayed or hidden
 * @param {Product|null} product, the product used to pre-fill form
 * @param {function} displayError, callBack function to run when we want to display an error
 * @param {function} handleClose, callBack function to run when finished with form
 */
export default function EditProductDialog(props: {
    open: boolean;
    product: Product | null;
    displayError: (errorMsg: string) => void;
    handleClose: () => void;
}) {
    const [productName, setProductName] = useState<string>("");
    const [scrumMasterName, setScrumMasterName] = useState<string>("");
    const [productOwnerName, setProductOwnerName] = useState<string>("");
    const [developers, setDevelopers] = useState<string>("");
    const [methodology, setMethodology] = useState<string>("");
    const [location, setLocation] = useState<string>("");

    const [productNameErr, setProductNameErr] = useState<string>("");
    const [scrumMasterErr, setScrumMasterErr] = useState<string>("");
    const [productOwnerErr, setProductOwnerErr] = useState<string>("");
    const [developersErr, setDevelopersErr] = useState<string>("");
    const [methodologyErr, setMethodologyErr] = useState<string>("");
    const [locationErr, setLocationErr] = useState<string>("");

    //Reset all fields
    function reset() {
        setProductName("");
        setScrumMasterName("");
        setProductOwnerName("");
        setDevelopers("");
        setMethodology("");
        setLocation("");

        setProductNameErr("");
        setScrumMasterErr("");
        setProductOwnerErr("");
        setDevelopersErr("");
        setMethodologyErr("");
        setLocationErr("");
    }

    useEffect(() => {
        if (props.product == null) {
            setProductName("");
            setScrumMasterName("");
            setProductOwnerName("");
            setDevelopers("");
            setMethodology("");
            setLocation("");
        } else {
            setProductName(props.product.productName);
            setScrumMasterName(props.product.scrumMasterName);
            setProductOwnerName(props.product.productOwnerName);
            setDevelopers(props.product.developers.join(", "));
            setMethodology(props.product.methodology);
            setLocation(props.product.location);
        }
    }, [props.product]);

    /**
     * @param {SelectChangeEvent} event, corresponding event on field change
     * @param {function} setFunction, setState that will be run on field change
     */
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
            location,
        };
        updateProduct(productRequest) //TODO
            .then((productResult) => {
                reset();
                props.handleClose();
            })
            .catch((error: Error) => {
                try {
                    let parse = JSON.parse(error.message);
                    props.displayError(parse.mainMsg);
                    setProductNameErr(parse.productName);
                    setScrumMasterErr(parse.scrumMasterName);
                    setProductOwnerErr(parse.productOwnerName);
                    setDevelopersErr(parse.developers);
                    setMethodologyErr(parse.methodology);
                    setLocationErr(parse.location);
                } catch (error2) {
                    props.displayError(error.message);
                }
            });
    }

    function handleCancel(): void {
        reset();
        props.handleClose();
    }

    function handleDelete(): void {
        if (props.product != null) {
            deleteProduct(props.product)
                .then(() => {
                    console.log("successfully deleted product");
                    reset();
                    props.handleClose();
                })
                .catch((error) => {
                    props.displayError(JSON.stringify(error));
                });
        }
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>Edit product</DialogTitle>
            <DialogContent>
                <DialogContentText>Enter product details</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="edit_dialog_productName"
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
                    id="edit_dialog_scrumMaster"
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
                    id="edit_dialog_productOwner"
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
                    id="edit_dialog_developers"
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
                        id="edit_dialog_methodology"
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
                <TextField
                    autoFocus
                    margin="dense"
                    id="edit_dialog_location"
                    label="Location"
                    type="text"
                    fullWidth
                    value={location}
                    error={locationErr != ""}
                    helperText={locationErr}
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        handleFieldChange(event, setLocation);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete}>Delete</Button>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
