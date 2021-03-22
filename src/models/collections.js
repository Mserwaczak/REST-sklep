const BaseModel = require('./baseModel');
const {Model} = require('objection')

class Collection extends BaseModel{
    static get tableName()
    {
        return 'collections';
    }

    static get jsonSchema(){
        return{
            type: 'object',
            properties: {
                name: {type: 'string'},
                description: {type: 'string'}
            }
        }
    }

    static relationMappings = {
        clothes: {
            relation: Model.BelongsToOneRelation,
            modelClass: require('./clothes'),
            join: {
                from: 'collections.clothes_id',
                to: 'clothes.id'
            }
        }

    };
}

module.exports = Collection;