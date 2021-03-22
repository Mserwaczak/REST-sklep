const {Router} = require('express')
const Receipt = require('../../models/receipts')
const Clothes = require('../../models/clothes')
const asyncHandler = require("../asyncHandler");
const { raw } = require('objection');
const ReceiptsNotFoundException = require("../../exceptions/receiptsNotFoundException");
const ClothesNotFoundException = require("../../exceptions/clothesNotFoundException");

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    let receipts = Receipt
        .query()
        .select('order_number','quantity', 'receipt.id')
        .withGraphJoined('clothes')
        .withGraphJoined('clients')
        .modifyGraph('clients', builder => builder.select('login'))
        .modifyGraph('clothes', builder => builder.select('brand', 'size'))

    res.send(await receipts);

}))

router.get('/:id',asyncHandler(async (req, res) =>{
    const {id} = req.params;
    const receipts = await Receipt.query()
        .select('order_number','quantity', 'receipt.id', 'summary').where('order_number', 'like', id)
        .withGraphJoined('clothes')
        .withGraphJoined('clients')
        .modifyGraph('clients', builder => builder.select('login'))
        .modifyGraph('clothes', builder => builder.select('brand', 'size'));

    if(!receipts) throw new ReceiptsNotFoundException();
    res.send(receipts);
}))

router.get('/summary/:id', asyncHandler(async (req, res) => {
    const {id} = req.params;
    let receipts = Receipt
        .query()
        .sum('summary as SUMMARY')
        .where('order_number','like', id)

    res.send(await receipts);

}))

router.post('/', asyncHandler(async (req, res)=>{
    const{clothes_id, order_number, quantity, clients_id} = req.body;
    const clothes = await Clothes.query().findById(clothes_id);
    const price = await Clothes.query().select(raw('price')).where(raw('?? == id', clothes_id))
    const summary = price[0].price*quantity

    if(!clothes) throw new ClothesNotFoundException();

    const receipt = await Receipt.query().insertGraphAndFetch({
        order_number,
        quantity,
        summary,
        clothes: [{
            '#dbRef': clothes_id
        }],
        clients: {
            '#dbRef': clients_id
        }


    });

    res.status(201).send(receipt);

}))

router.delete('/:id',asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const receipts = await Receipt.query().findById(id);
    if(!receipts) throw new ReceiptsNotFoundException();

    const trx = await  Receipt.startTransaction();
    try{
        await Receipt.query(trx).deleteById(id);
        await trx.commit();

    }catch(e){
        await trx.rollback()
        throw e;
    }

    res.status(204).end();
}))



module.exports = router;