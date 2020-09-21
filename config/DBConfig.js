import mongoose from 'mongoose';

const DBConnection = () =>{
    mongoose.connect("mongodb+srv://alexandre:pass@igti-fullstack-bootcamp.zn883.mongodb.net/IGTI?retryWrites=true&w=majority",{ 
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

