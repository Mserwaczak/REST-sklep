const {Model} = require('objection')
const knex = require('../knex')
const BaseModel = require("./baseModel");

Model.knex(knex);

class Receipts extends BaseModel{
    static get tableName(){
        return 'receipt';
    }

    static get jsonSchema(){
        return{
            type: 'object',
            properties: {
                number_order: {type: 'int'},
                quantity: {type: 'int'},
                summary: {type: 'double'}
            }
        }
    }

    static relationMappings = {
        clients: {
            relation: Model.BelongsToOneRelation,
            modelClass: require('./clients'),
            join: {
                from: 'receipt.client_id',
                to: 'clients.id'
            }
        },
        clothes: {
            relation: Model.ManyToManyRelation,
            modelClass: require('./clothes'),
            join: {
                from: 'receipt.id',
                to: 'clothes.id',
                through: {
                    from: 'clothes_receipt.receipt_id',
                    to: 'clothes_receipt.clothes_id'
                },
            },
        }

    };
}

module.exports = Receipts;