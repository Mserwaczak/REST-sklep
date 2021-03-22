const {Router} = require('express')
const Clothes = require('../../models/clothes')
const Producer = require('../../models/producers')
const asyncHandler = require("../asyncHandler");
const ClothesNotFoundException = require("../../exceptions/clothesNotFoundException");
const ProducerNotFoundException = require("../../exceptions/producerNotFoundException");

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    let clothes = Clothes
        .query()
        .select('brand', 'category', 'size', 'price', 'clothes.id')
        .withGraphJoined('collections')
        .withGraphJoined('producers')
        .modifyGraph('collections', builder => builder.select('name'))
        .modifyGraph('producers', builder => builder.select('name', 'address'))

    if(req.query.brand){
        clothes = clothes.where('brand', 'like', `%${req.query.brand}%`)
    }
    if(req.query.category){
        clothes = clothes.where('category', 'like', `%${req.query.category}%`)
    }
    if(req.query.size){
        clothes = clothes.where('size', 'like', `%${req.query.size}%`)
    }
    if(req.query.name){
        clothes = clothes.where('collections.name', 'like', `%${req.query.name}%`)
    }

    res.send(await clothes);

}))

router.get('/count', asyncHandler(async (req, res) => {
    let clothes = Clothes
        .query()
        .count("brand")

    res.send(await clothes);

}))

router.get('/sort-price', asyncHandler(async (req, res) => {
    let clothes = Clothes
        .query()
        .select('brand', 'category', 'size', 'price', 'clothes.id')
        .withGraphJoined('collections')
        .withGraphJoined('producers')
        .modifyGraph('collections', builder => builder.select('name'))
        .modifyGraph('producers', builder => builder.select('name', 'address'))
        .orderBy('price')

    res.send(await clothes);

}))

router.get('/:id',asyncHandler(async (req, res) =>{
    const {id} = req.params;
    const clothes = await Clothes.query().findById(id);
    if(!clothes) throw new ClothesNotFoundException();
    res.send(clothes);
}))

router.post('/', asyncHandler(async (req, res)=>{
    const{producers_id, brand, category, size, price, collections} = req.body;
    const producers = await Producer.query().findById(producers_id);
    if(!producers) throw new ProducerNotFoundException();


    const clothes = await Clothes.query().insertGraphAndFetch({
       brand,
       category,
       size,
       price,
       collections,
       producers: [{
           '#dbRef': producers_id
       }
       ]


    });

    res.status(201).send(clothes);

}))

router.put('/:id', asyncHandler(async (req, res)=>{
    const id = req.params.id;
    const updatedClothes = await Clothes.query().patchAndFetchById(id, req.body)
    if(!updatedClothes) throw new ClothesNotFoundException();
    res.send(updatedClothes);
}))

router.delete('/:id',asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const clothes = await Clothes.query().findById(id);
    if(!clothes) throw new ClothesNotFoundException();

    const trx = await  Clothes.startTransaction();
    try{
        await Clothes.query(trx).deleteById(id);
        await trx.commit();

    }catch(e){
        await trx.rollback()
        throw e;
    }


    res.status(204).end();
}))



module.exports = router;