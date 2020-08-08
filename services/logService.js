import winston from "winston";

const logger = (logName)=>{
    const {combine,printf,label,timestamp} = winston.format;

    const myFormat = printf(({level,message,label,timestamp})=>`${timestamp} [${label}] ${level}: ${message}`);
    
    return winston.createLogger({
        transports:[
            new(winston.transports.Console)(),
            new(winston.transports.File)({filename:`./logs/${logName}.log`})
        ],
        format: combine(
            label({label:logName}),
            timestamp(),
            myFormat
        )
    })
}

export default logger;
