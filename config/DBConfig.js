import mongoose from 'mongoose';
import Constants from '../Constants';

const DBConnection = (user,pass) =>{
    mongoose.connect(Constants.MONGO_CONNECTION.replace('%u',user).replace('%p',pass),{ 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(()=>
            console.log('Conectado ao mongo db')
        ).catch(e=> console.log(e));
}

const DBClose = () =>{
    mongoose.connection.close();
}

export { DBConnection, DBClose };

