const {Model} = require('objection')
const knex = require('../knex')
const BaseModel = require("./baseModel");

Model.knex(knex);

class Producer extends BaseModel{
    static get tableName(){
        return 'producers';
    }

    static get jsonSchema(){
        return{
            type: 'object',
            properties: {
                name: {type: 'string'},
                address: {type: 'string'}
            }
        }
    }
}

module.exports = Producer;