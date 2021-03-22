class ReceiptsNotFoundException extends Error {
    constructor(message) {
        super(message || "Receipts Not Found");
        this.status = 404;
    }
}
module.exports = ReceiptsNotFoundException;