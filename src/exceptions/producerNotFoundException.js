class ProducerNotFoundException extends Error {
    constructor(message) {
        super(message || "Producer Not Found");
        this.status = 404;
    }
}
module.exports = ProducerNotFoundException;