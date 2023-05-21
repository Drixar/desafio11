import path from "path";
import url from 'url';
import bcrypt from 'bcrypt';

const password = 'drixar';

export const connectionString = `mongodb+srv://drixar:${password}@cluster0.e9tqcfs.mongodb.net/ecommerce`


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const options = {
    fileSystem: {
        pathProducts: 'productos.json',
        pathCarts: 'carritos.json',
        pathChat: 'chat.json',
    },
    mongoDB:{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
}

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}