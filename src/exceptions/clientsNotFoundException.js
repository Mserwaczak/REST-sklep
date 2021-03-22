class ClientsNotFoundException extends Error {
    constructor(message) {
        super(message || "Clients Not Found");
        this.status = 404;
    }
}
module.exports = ClientsNotFoundException;