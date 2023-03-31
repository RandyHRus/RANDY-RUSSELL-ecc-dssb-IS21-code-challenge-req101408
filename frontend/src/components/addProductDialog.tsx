import React, { useState } from "react";
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
import { createProduct } from "@/apiAccess";

/**
 * Pop up dialog form used to create a product
 */
export default function AddProductDialog(props: {
    open: boolean;
    handleClose: () => void;
    displayError: (errorMsg: string) => void;
}) {
    const [productName, setProductName] = useState<string>("");
    const [scrumMasterName, setScrumMasterName] = useState<string>("");
    const [productOwnerName, setProductOwnerName] = useState<string>("");
    const [developers, setDevelopers] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [methodology, setMethodology] = useState<string>("");

    const [productNameErr, setProductNameErr] = useState<string>("");
    const [scrumMasterErr, setScrumMasterErr] = useState<string>("");
    const [productOwnerErr, setProductOwnerErr] = useState<string>("");
    const [developersErr, setDevelopersErr] = useState<string>("");
    const [startDateErr, setStartDateErr] = useState<string>("");
    const [methodologyErr, setMethodologyErr] = useState<string>("");

    // Reset all fields
    function reset() {
        setProductName("");
        setScrumMasterName("");
        setProductOwnerName("");
        setDevelopers("");
        setStartDate("");
        setMethodology("");

        setProductNameErr("");
        setScrumMasterErr("");
        setProductOwnerErr("");
        setDevelopersErr("");
        setStartDateErr("");
        setMethodologyErr("");
    }

    /**
     * @param {SelectChangeEvent} event, corresponding event on field change
     * @param {function} setFunction, setState that will be run on field change
     */
    function handleFieldChange(
        event: SelectChangeEvent,
        setFunction: (value: string) => void
    ) {
        console.log(event.target.value as string);
        setFunction(event.target.value as string);
    }

    function handleSubmit(): void {
        let productRequest: Product = {
            productId: -1, //will be generated in backend.
            productName,
            productOwnerName,
            developers: developers.split(","),
            startDate,
            scrumMasterName,
            methodology,
        };
        createProduct(productRequest)
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
                    setStartDateErr(parse.startDate);
                    setMethodologyErr(parse.methodology);
                } catch (error2) {
                    props.displayError(error.message);
                }
            });
    }

    function handleCancel(): void {
        reset();
        props.handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>Add product</DialogTitle>
            <DialogContent>
                <DialogContentText>Enter new product details</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="add_dialog_product_name"
                    label="Product name"
                    type="text"
                    fullWidth
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
                    id="add_dialog_scrumMaster"
                    label="Scrum master"
                    type="text"
                    fullWidth
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
                    id="add_dialog_productOwner"
                    label="Product owner"
                    type="text"
                    fullWidth
                    error={productOwnerErr != ""}
                    helperText={productOwnerErr}
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(event, setProductOwnerName)
                    }
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="add_dialog_developers"
                    label="developers (separate by comma)"
                    type="text"
                    fullWidth
                    error={developersErr != ""}
                    helperText={developersErr}
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(event, setDevelopers)
                    }
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="add_dialog_startDate"
                    type="date"
                    fullWidth
                    error={startDateErr != ""}
                    helperText={startDateErr}
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(event, setStartDate)
                    }
                />
                <FormControl fullWidth>
                    <InputLabel>{"Methodology"}</InputLabel>
                    <Select
                        labelId="methodology"
                        id="add_dialog_methodology"
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
