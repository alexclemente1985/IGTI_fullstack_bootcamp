import express from "express";

const app = express();
app.use(express.static("public"));

app.listen(3004,()=>{
    console.log("API testes iniciada...")
});
