import express from "express";
import { buildCheckFunction, validationResult } from "express-validator";
import fs from "fs";
import { promisify } from "util";
import Constants from "../Constants";
import logger from "../services/logService";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const buildCheck = buildCheckFunction(['body']);

const router = express.Router();

const validationArray = [
    buildCheck('name').isLength({min: 5}).withMessage('Nome tem que ter mais de 5 caracteres!'),
    buildCheck('name').notEmpty().withMessage('Nome não pode ser vazio!'),
    buildCheck('balance').exists().withMessage("Balance não pode ser vazio!!!"),
    buildCheck('balance').isNumeric().withMessage("Balance tem que ser numérico"),
    buildCheck('balance').isFloat().withMessage("Balance tem que ser numérico"),
    buildCheck('balance').not().isString().withMessage("Balance tem que ser numérico"),
]

const validationArrayForPatch = [
    buildCheck('id').exists().withMessage('ID não pode ser nulo!!!'),
    buildCheck('id').notEmpty().withMessage('ID não pode ser nulo!!!'),
    buildCheck('balance').exists().withMessage("Balance não pode ser vazio!!!"),
    buildCheck('balance').isNumeric().withMessage("Balance tem que ser numérico"),
    buildCheck('balance').isFloat().withMessage("Balance tem que ser numérico"),
    buildCheck('balance').not().isString().withMessage("Balance tem que ser numérico"),
]

const validationArrayForPut = [
    buildCheck('id').exists().withMessage('ID não pode ser nulo!!!'),
    buildCheck('id').notEmpty().withMessage('ID não pode ser nulo!!!'),
    buildCheck('name').notEmpty().withMessage('Nome não pode ser vazio!'),
    buildCheck('name').isLength({min: 5}).withMessage('Nome tem que ter mais de 5 caracteres!'),
    buildCheck('balance').exists().withMessage("Balance não pode ser vazio!!!"),
    buildCheck('balance').isNumeric().withMessage("Balance tem que ser numérico"),
    buildCheck('balance').isFloat().withMessage("Balance tem que ser numérico"),
    buildCheck('balance').not().isString().withMessage("Balance tem que ser numérico"),
]

const errorFormatter = ({msg})=>{
    return msg;
}

const validationHandler = (req)=>{
    console.log("req", req.body)
    const errors = validationResult(req).formatWith(errorFormatter);
    console.log("error validation: ",errors)
        if(!errors.isEmpty()){
            throw new Error(`${errors.mapped().name||errors.mapped().balance||errors.mapped().id}`);
        }
}

router.post("/",validationArray,async (req,res,next)=>{
    try{
        validationHandler(req);
        let account = req.body;

        const data = JSON.parse(await readFile(Constants.ACCOUNT_FILENAME));
        
        account = {
            id:data.nextID++, 
            name: account.name,
            balance: account.balance
        };
       
        data.accounts.push(account);
        
        //atributo "2" serve para formatar o json criado, não indicado para uso profissional pois o json pode ficar muito pesado desnecessariamente
        await writeFile(Constants.ACCOUNT_FILENAME,JSON.stringify(data,null,2));
        
        logger(Constants.ACCOUNT).info(`Novo registro inserido via POST em ${Constants.ACCOUNT_FILENAME}`)
        res.send(account);
    }catch(err){
        next(err)
    }
});

router.get("/", async (req,res,next)=>{
    try{
        const data = JSON.parse(await readFile(Constants.ACCOUNT_FILENAME));
        const {accounts} = data;
        logger(Constants.ACCOUNT).info(`Registros retornados via GET de ${Constants.ACCOUNT_FILENAME}`)
        
        res.send(accounts);
    }catch(err){
        next(err)
    }
})

router.get("/:id",async (req,res,next)=>{
    try{
        const data = JSON.parse(await readFile(Constants.ACCOUNT_FILENAME));
        const account = data.accounts.filter(account => account.id === parseInt(req.params.id));
        
        if(account.length===0){
            throw new Error('Registro não encontrado!');
        }

        logger(Constants.ACCOUNT).info(`Registro de id ${req.params.id} retornado via GET de ${Constants.ACCOUNT_FILENAME}`)
        
        res.send(JSON.stringify(account));

    }catch(err){
        next(err)
    }
})

router.delete("/:id",async (req,res,next)=>{
    try{
        const data = JSON.parse(await readFile(Constants.ACCOUNT_FILENAME));
        const accounts = data.accounts;
        data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id));
        
        if(Object.keys(data.accounts).length===accounts.length){
            throw new Error('Registro não encontrado!');
        }
        await writeFile(Constants.ACCOUNT_FILENAME,JSON.stringify(data,null,2));
        
        logger(Constants.ACCOUNT).info(`Registro de id ${req.params.id} deletado via DELETE de ${Constants.ACCOUNT_FILENAME}`)
        
        res.send(`Registro ${req.params.id} excluído com sucesso!`);

    }catch(err){
        next(err)
    }
})

//atualizações completas do registro
router.put("/",validationArrayForPut,async (req,res,next)=>{
    
    try{
        validationHandler(req);

        let accountToUpdate = req.body;
        
        const data = JSON.parse(await readFile(Constants.ACCOUNT_FILENAME));
        const index = data.accounts.findIndex((account)=> account.id === accountToUpdate.id);

        if(index === -1){
            throw new Error('Registro não encontrado!');
        }

        data.accounts[index].name = accountToUpdate.name;
        data.accounts[index].balance = accountToUpdate.balance;

        await writeFile(Constants.ACCOUNT_FILENAME,JSON.stringify(data,null,2));
        
        logger(Constants.ACCOUNT).info(`Registro de id ${accountToUpdate.id} atualizado via PATCH de ${Constants.ACCOUNT_FILENAME}`)
        
        res.send(data.accounts);

    }catch(err){
        next(err)
    }
})

//Realizado para modificações parciais do registro
router.patch("/updateBalance",validationArrayForPatch,async (req,res, next)=>{
    try{
        validationHandler(req);
        
        let accountToUpdate = req.body;
        const data = JSON.parse(await readFile(Constants.ACCOUNT_FILENAME));
        const index = data.accounts.findIndex((account)=> account.id === accountToUpdate.id);
        
        if(index === -1){
            throw new Error('Registro não encontrado!')
        }

        data.accounts[index].balance = accountToUpdate.balance;
        
        await writeFile(Constants.ACCOUNT_FILENAME,JSON.stringify(data,null,2));
        
        logger(Constants.ACCOUNT).info(`Registro de id ${accountToUpdate.id} atualizado via PATCH de ${Constants.ACCOUNT_FILENAME}`)
        
        res.send(data.accounts);
        
    }catch(err){
       next(err)
    }
})

router.use((err,req,res,next)=>{
    logger(Constants.ACCOUNT).error(err.message);
    res.status(400).send({error: err.message});
})

export default router;
