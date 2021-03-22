const BaseModel = require('./baseModel');
const {Model} = require('objection')

class Clients extends BaseModel{
    static get tableName()
    {
        return 'clients';
    }

    static get jsonSchema(){
        return{
            type: 'object',
            properties: {
                login: {type: 'string'},
                password: {type: 'string'},
                name: {type: 'string'},
                surname: {type: 'string'},
                email: {type: 'string'},
            }
        }
    }

    static relationMappings() {
        return {
            receipt: {
                relation: Model.HasManyRelation,
                modelClass: require('./receipts'),
                join: {
                    from: 'clients.id',
                    to: 'receipt.client_id'
                }
            }
        };
    }
}

module.exports = Clients;