class LoginTakenException extends Error {
    constructor(message) {
        super(message || "Login or email already used");
        this.status = 409;
    }
}
module.exports = LoginTakenException;