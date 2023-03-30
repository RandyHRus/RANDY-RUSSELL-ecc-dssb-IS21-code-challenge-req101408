// Interface used to generate object that contains error messages.
// mainMsg will contain the main error message to be displayed.
// If there are any attribute specific errors, corresponding properties will contain the error.
export default interface ProductError {
    mainMsg: string;
    productName: string;
    productOwnerName: string;
    developers: string;
    startDate: string;
    scrumMasterName: string;
    methodology: string;
}
