const notFoundErrorHandler = (req, res, next) => {
    res.status(404).send(
        {
            message: "Can't find"
        }
    )
}

module.exports = notFoundErrorHandler;