import cors from "cors";
import express from "express";
import fs from "fs";
import swaggerUI from "swagger-ui-express";
//recurso para o caso de NodeJS 8
import { promisify } from "util";
import Constants from "./Constants";
import { swaggerDocument } from "./js/doc";
import accountsRouter from "./routes/accounts";
import logger from "./services/logService";


const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors({origin:'http://localhost:3004', optionsSuccessStatus: 200}));
app.use("/doc",swaggerUI.serve,swaggerUI.setup(swaggerDocument))

app.use("/account",accountsRouter);

app.listen(2700,async ()=>{
    try{
        await readFile(Constants.ACCOUNT_FILENAME);
        logger(Constants.INDEX).info("API iniciou...");
    }catch(err){
        logger(Constants.INDEX).warn("API iniciou mas registro de contas ainda precisa ser criado...");
        const initialJson = {
            nextID:1,
            accounts: []
        }
        try{
            await writeFile(Constants.ACCOUNT_FILENAME,JSON.stringify(initialJson)).then(()=>{
                logger(Constants.INDEX).info("API iniciou e criou o arquivo de dados!");
            }).catch((err)=>{
                logger(Constants.INDEX).error(err);
            });
           
        }catch(err){
            logger(Constants.INDEX).error(err);
        }
       
    }
})
