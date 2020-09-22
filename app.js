import dotenv from 'dotenv';
import express from 'express';
import fs from "fs";
import { promisify } from "util";
import { DBClose, DBConnection } from './config/DBConfig';
import Constants from "./Constants";
import AccountModel from './models/AccountModel';
import accountsRouter from './routes/AccountsRouter';

const readFile = promisify(fs.readFile);

const app = express();
app.use(express.json());
app.use(accountsRouter);

dotenv.config();
const user = process.env.USERDB;
const pass = process.env.PWDDB;
const port = process.env.PORT;

app.listen(port,async (req,res)=>{
    console.log('API iniciada!');
    
    try {
        DBConnection(user,pass);
        const databaseAccounts = await AccountModel.find();
        if(databaseAccounts.length === 0){
          try{
              const data = JSON.parse(await readFile(Constants.ACCOUNTS_FILENAME));
             console.log("Carregando a base de dados...")
             data.map(async (item)=>{
              const account = new AccountModel(item);
              await account.save().then(()=>{
                  console.log("Base carregada com sucesso!")
              });
             })
          }catch(e){
              console.log(e)
          }
        }
      } catch (err) {
          console.log(err)
     }finally{
       DBClose()
     }
});


