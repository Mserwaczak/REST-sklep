const {Model} = require('objection')
const knex = require('../knex')
const BaseModel = require("./baseModel");

Model.knex(knex);

class Clothes extends BaseModel{
    static get tableName(){
        return 'clothes';
    }

    static get jsonSchema(){
        return{
            type: 'object',
            properties: {
                brand: {type: 'string'},
                category: {type: 'string'},
                size: {type: 'string'},
                price:{type: 'double'}
            }
        }
    }

    static get relationMappings(){
        return{
            collections: {
                relation: Model.HasManyRelation,
                modelClass: require('./collections'),
                join: {
                    from: 'clothes.id',
                    to: 'collections.clothes_id'
                }
            },
            producers: {
                relation: Model.ManyToManyRelation,
                modelClass: require('./producers'),
                join: {
                    from: 'clothes.id',
                    to: 'producers.id',
                    through: {
                        from: 'producers_clothes.clothes_id',
                        to: 'producers_clothes.producers_id'
                    },
                },
            },
        }
    }
}

module.exports = Clothes;