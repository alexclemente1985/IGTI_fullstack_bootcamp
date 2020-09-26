import dotenv from 'dotenv';
import express from 'express';
import { DBClose, DBConnection } from '../config/DBConfig';
import AccountModel from '../models/AccountModel';

const formatValue = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatBalanceMsg = (agency, account, balance) => `Saldo atual da conta ${account} agência ${agency}: ${formatValue(balance)}`; 
const formatAvgMsg = (agency, avg) => `Saldo médio das contas da agência ${agency}: ${formatValue(avg)}`;
const balanceFormatter = (agency, account, name, balance) => {
    return name ? `Agência: ${agency} Conta: ${account} Nome: ${name} Saldo: ${balance}` :
                  `Agência: ${agency} Conta: ${account} Saldo: ${balance}`;}


const accountsRouter = express();

dotenv.config();
const user = process.env.USERDB;
const pass = process.env.PWDDB;

//CREATE
accountsRouter.post('/account', async(req,res)=>{
    try{
        DBConnection(user,pass);
        const account = new AccountModel(req.body);
        await account.save();
        res.send(account);
    }catch(error){
     res.status(500).send(error);
    }finally{
        DBClose();
    }
});

//RETRIEVE
accountsRouter.get('/account', async(req,res)=>{
    try{
        DBConnection(user,pass);    
        const account = await AccountModel.find({});
        
        res.send(account);
    
    }catch(error){
     res.status(500).send(error);
    }finally{
        DBClose();
    }
});

//DEPOSIT
accountsRouter.patch('/account', async(req,res)=>{
    try{
        DBConnection(user,pass)    
        const {agencia, conta, valor} = req.body;
        const account = await AccountModel.findOneAndUpdate({agencia,conta},
            {$inc:{balance:valor}},{new: true});

        if(!account){
            throw new Error("Conta não encontrada");
        }    

        res.send(formatBalanceMsg(agencia, conta, account.balance));

    }catch(error){
        res.status(500).send(error.message);
    }
});

//WITHDRAW
accountsRouter.patch('/account/withdraw', async(req,res)=>{
    try{
        DBConnection(user,pass);
        const {agencia, conta, valor} = req.body;
        const account = await AccountModel.findOne({agencia,conta});
        
        if(parseFloat(account.balance)<valor){
            throw new Error("Valor insuficiente na conta");
        }
        const accountToUpd = await AccountModel.findOneAndUpdate({agencia,conta},
            {$inc:{balance:-valor}},{new: true});

        if(!accountToUpd){
            throw new Error("Conta não encontrada");
        }

        res.send(formatBalanceMsg(agencia,conta,accountToUpd.balance));

    }catch(error){
        res.status(500).send(error.message);
    }finally{
        DBClose();
    }
});

//ACCOUNT BALANCE
accountsRouter.get('/account/balance', async(req,res)=>{
    try{
    DBConnection(user,pass);
    const {agencia, conta} = req.body;    
    const account = await AccountModel.findOne({agencia,conta});
        
    if(!account) {
        throw new Error("Conta inexistente")
    };

    res.send(formatBalanceMsg(agencia,conta,account.balance));
    
    }catch(error){
     res.status(500).send(error.message);
    }finally{
        DBClose();
    }
});

//ACCOUNT CLOSURE
accountsRouter.delete('/account/closure',async(req,res)=>{
    try{
        DBConnection(user,pass);
        const{agencia,conta}=req.body;
        const account = await AccountModel.findOneAndDelete({agencia,conta});

        if(!account) {
            throw new Error("deleteError")
        };

        const accounts = await AccountModel.find({});

        res.status(200).send(`Total de contas ativas: ${accounts.length}`)


    }catch(error){
        console.log(error)
        switch(error.message){
            case 'deleteError':
                res.status(404).send("Conta inexistente");
                break;
            default:
                res.status(500).send(error.message);   
        }
    }finally{
        DBClose();
    }
})

//TRANSFERS
accountsRouter.patch('/account/transfer', async(req,res)=>{
    try{
        DBConnection(user,pass);
        const {agenciaorigem,agenciadestino,contaorigem,contadestino,valor} = req.body;
        let debt = 0;
        let credit = 0;

        const accounts = await AccountModel.find({
            $or:[
                {$and:[{conta: contaorigem},{agencia:agenciaorigem}]},
                {$and:[{conta: contadestino},{agencia:agenciadestino}]}
            ]
        });

        if(!accounts){
            throw new Error("inexistentAccounts");
        }else if(accounts.length<2){
            throw new Error("inexistentAccount")
        }
        
        credit = valor;
        debt = agenciaorigem === agenciadestino ?  valor : valor + 8;
        
        const originAccountToUpd = await AccountModel.bulkWrite([
            {updateOne:{
                filter:{$and:[{conta: contaorigem},{agencia:agenciaorigem}]},
                update:{$inc:{balance:-debt}}
            }
            },
            {updateOne:{
                filter:{$and:[{conta: contadestino},{agencia:agenciadestino}]},
                update:{$inc:{balance:credit}}
            }}
        ]);

        if(!originAccountToUpd){
            throw new Error('transferError')
        }

        const updatedOriginAccount = await AccountModel.findOne({agencia: agenciaorigem,conta: contaorigem});

        res.send(formatBalanceMsg(agenciaorigem,contaorigem,updatedOriginAccount.balance));

    }catch(error){
        console.log(error)
        switch(error.message){
            case 'inexistentAccounts':
                res.status(404).send("Contas inexistentes");
                break;
            case 'inexistentAccount':
                res.status(404).send("Uma das contas é inexistente");
                break;
            case 'transferError':
                res.status(404).send("Erro durante a operação bancária");
                break;            
            default:
                res.status(500).send(error.message);   
        }
    }finally{
        DBClose();
    }
})


//DELETE
accountsRouter.delete('/account/:id', async(req,res)=>{
    try{
        DBConnection(user,pass);
        const id = req.params.id;
        const accountDeleted = await AccountModel.findByIdAndDelete({_id: id});
        if(!accountDeleted){
            res.status(404).send('Documento nao encontrado para exclusao!')
        }else{
            res.status(200).send('Documento deletado com sucesso!')
        }    
    }catch(error){
     res.status(500).send(error);
    }finally{
        DBClose();
    }
});

// AGENCY BALANCES AVERAGE
accountsRouter.get('/accounts/average',async (req,res)=>{
    try{
        DBConnection(user,pass);
        const {agencia} = req.body;

        const agencyAverage = await AccountModel.aggregate([
            {$match:{agencia: agencia}},
            {$group:{_id:null, average:{$avg: "$balance"}}}
        ]);

        if(!agencyAverage){
            throw new Error("aggregateError")
        }
        
        res.status(200).send(formatAvgMsg(agencia,agencyAverage[0].average));

    }catch(error){
        switch(error.message){
            case "aggregateError":
                res.status(404).send("Erro durante o cálculo da média")
            default:
                res.status(500).send(error.message);
                break;
        }
    }finally{
        DBClose();
    }
})

//MIN BALANCE
accountsRouter.get('/accounts/minbalance', async(req,res)=>{
    try{
        DBConnection(user,pass);
        const {qtd} = req.body;    
        const data = await AccountModel.find({}).limit(qtd).sort({balance:1})

        if(!data) {
            throw new Error("filterError")
        };
        
        const clients = data.map((client)=>{
            return balanceFormatter(client.agencia, client.conta,null,client.balance);
        })

        res.send(clients);

    }catch(error){
        switch(error.message){
            case "filterError":
                res.status(404).send("Erro durante o retorno dos dados")
            default:
                res.status(500).send(error.message);
                break;
        }
    }finally{
        DBClose();
    }
});

//MAX BALANCES
accountsRouter.get('/accounts/richies', async(req,res)=>{
    try{
        DBConnection(user,pass);
        const {qtd} = req.body;    
        const data = await AccountModel.find({}).limit(qtd).sort({balance:-1,name:1})

        if(!data) {
            throw new Error("filterError")
        };
        
        const clients = data.map((client)=>{
            return balanceFormatter(client.agencia, client.conta,client.name,client.balance);
        })

        res.send(clients);

    }catch(error){
        switch(error.message){
            case "filterError":
                res.status(404).send("Erro durante o retorno dos dados")
            default:
                res.status(500).send(error.message);
                break;
        }
    }finally{
        DBClose();
    }
});

//PRIVATE AGENCY
accountsRouter.get('/accounts/private', async(req,res)=>{
    try{
        DBConnection(user,pass);
       
        const data = await AccountModel.find({})
            .sort({agencia:1,balance:-1})
        
        if(!data) {
            throw new Error("filterError")
        };

        let agency = 0;
        let richies = [];
       
        data.map((client)=>{
            if(agency !== client.agencia && client.agencia !== 99){
                agency = client.agencia;
                richies.push(client);
            }
        })
        
        let updates = [];
        richies.map((client)=>{
            if(client.agencia!==99){
                const command ={
                    updateOne: {
                        filter:{
                            agencia: client.agencia,
                            conta:client.conta
                        },
                        update:{
                            $set:{agencia:99}
                        }
                    }
                };
                updates.push(command);
            }
        })
        const updClients = await AccountModel.bulkWrite(updates);

        if(!updClients){
            throw new Error("updateError")
        }

        const richClients = await AccountModel.find({agencia: 99});

        res.send(richClients);

    }catch(error){
        switch(error.message){
            case "filterError":
                res.status(404).send("Erro durante o retorno dos dados");
                break;
            case "updateError":
                res.status(404).send("Erro durante a atualização dos dados");
                break;    
            default:
                res.status(500).send(error.message);
                break;
        }
    }finally{
        DBClose();
    }
});

export default accountsRouter;
