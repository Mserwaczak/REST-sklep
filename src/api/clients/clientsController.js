const {Router} = require('express')
const Client = require('../../models/clients')
const asyncHandler = require("../asyncHandler");
const bcrypt = require('bcryptjs');
const router = new Router();
const jwt = require("jsonwebtoken");
const LoginTakenException = require("../../exceptions/loginTakenException");
const ClientsNotFoundException = require("../../exceptions/clientsNotFoundException");

const SECRET_KEY = "9cc2243ab5d142fbc642ba43c46ec53756b11b9f12b854d84e372327a7a8f03514ebd9e5da6f296df605f33cedde7606a95a783fa5201bd56ab079fe0122c2fa";


authenticateToken = (req, res, next) => {
    let token = req.get("authorization");
    if(token){
        token = token.slice(7);
        jwt.verify(token, SECRET_KEY, (err, decoded)=>{
            if(err){
                res.json({
                    message: "Invalid token"
                });
            }else{
                next();
            }
        })
    }else{
        res.json({
            message: "Access denied! unauthorized user"
        })
    }
}


router.post('/register',asyncHandler(async (req, res) =>{

    const login = req.body.login;
    const password = bcrypt.hashSync(req.body.password);
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;

    const client1 = await Client.query().select('login').where('login', 'like', login);
    const client2 = await Client.query().select('email').where('email', 'like', email);

    if(client1[0] || client2[0]){
        throw new LoginTakenException();
    }else {
        const client = await Client.query().insert({
            login: login,
            password: password,
            name: name,
            surname: surname,
            email: email

        })
        const expiresIn = 24 * 60;
        const accessToken = jwt.sign({id: client.id}, SECRET_KEY, {expiresIn: expiresIn});

        res.status(200).send({"client": client, "access_token": accessToken, "expires_in": expiresIn});

    }}));

router.post('/login', asyncHandler(async(req, res) =>{
    const login = req.body.login;
    const password = req.body.password;

    const client1 = await Client.query().select('id').where('login', 'like', login);

    if(!client1[0]){
        throw new ClientsNotFoundException;
    }else{
        const client = await Client.query().findById(client1[0].id);
        const result = bcrypt.compareSync(password, client.password);
        if(!result) return res.status(401).send('Password not valid!');
        const expiresIn = 24*60;
        const accessToken = jwt.sign({id: client.id}, SECRET_KEY,{expiresIn: expiresIn});

        res.status(200).send({"client ": client, "access_token": accessToken, "expires_in": expiresIn});

    }

}));


router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    let clients = Client
        .query()
        .select('login', 'password', 'name', 'surname', 'email', 'clients.id')

    res.send(await clients);
}))

router.get('/:id', authenticateToken,asyncHandler(async (req, res) =>{
    const {id} = req.params;
    const clients = await Client.query().findById(id);
    if(!clients) throw new ClientsNotFoundException();
    res.send(clients);
}))

router.put('/:id', authenticateToken, asyncHandler(async (req, res)=>{
    const id = req.params.id;
    let updatedClients;

    const login = req.body.login;
    const password = bcrypt.hashSync(req.body.password);
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;

    const client1 = await Client.query().select('login').where('login', 'like', login);
    const client2 = await Client.query().select('email').where('email', 'like', email);

    if(client1[0] && client2[0]){
        throw new LoginTakenException();
    }else{
    updatedClients = await Client.query().patchAndFetchById(id, {
        login: login,
        password: password,
        name: name,
        surname: surname,
        email: email
    })}
    if(!updatedClients) throw new ClientsNotFoundException();
    res.send(updatedClients);
}))

router.delete('/:id', authenticateToken ,asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const clients = await Client.query().findById(id);
    if(!clients) throw new ClientsNotFoundException();

    const trx = await  Client.startTransaction();
    try{
        await Client.query(trx).deleteById(id);
        await trx.commit();

    }catch(e){
        await trx.rollback()
        throw e;
    }

    res.status(204).end();
}))


module.exports = router;