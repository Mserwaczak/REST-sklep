const {Router} = require('express')
const Producer = require('../../models/producers')
const asyncHandler = require("../asyncHandler");
const ProducerNotFoundException = require("../../exceptions/producerNotFoundException");

const router = new Router();


router.get('/', asyncHandler(async (req, res) => {
    let producers = Producer
        .query()
        .select('name', 'address', 'producers.id')

    res.send(await producers);

}))

router.post('/', asyncHandler(async (req, res)=>{
    const producers = await Producer.query().insert({
        name: req.body.name,
        address: req.body.address
    });
    res.status(201).send(producers);

}))

router.put('/:id', asyncHandler(async (req, res)=>{
    const id = req.params.id;
    const updatedProducers = await Producer.query().patchAndFetchById(id, req.body)
    if(!updatedProducers) throw new ProducerNotFoundException();
    res.send(updatedProducers);
}))

router.delete('/:id',asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const producers = await Producer.query().findById(id);
    if(!producers) throw new ProducerNotFoundException();

    const trx = await  Producer.startTransaction();
    try{
        await Producer.query(trx).deleteById(id);
        await trx.commit();

    }catch(e){
        await trx.rollback()
        throw e;
    }

    res.status(204).end();
}))

module.exports = router;