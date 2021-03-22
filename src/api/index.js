const {Router} = require('express')
const clothesRouter = require('./clothes/clothesController')
const producersRouter = require('./producers/producersController')
const receiptsRouter = require('./receipts/receiptsController')
const clientsRouter = require('./clients/clientsController')
const router = new Router();

router.use('/clothes', clothesRouter)
router.use('/producers', producersRouter)
router.use('/receipts', receiptsRouter)
router.use('/clients', clientsRouter)

module.exports = router;