class ClothesNotFoundException extends Error {
    constructor(message) {
        super(message || "Clothes Not Found");
        this.status = 404;
    }
}
module.exports = ClothesNotFoundException;