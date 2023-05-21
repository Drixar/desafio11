import { ManagerMongo } from "../../managers/Mongo.js";
import mongoosePaginate from "mongoose-paginate-v2"

class ProductsDaoMongo extends ManagerMongo{
    constructor(collectionName, collectionSchema){
        super(collectionName, collectionSchema.plugin(mongoosePaginate))
    }
}

export {ProductsDaoMongo}