// // require
// const { connect } = require("mongoose");
// const { mosaic } = require("./schema.js");
// const CREDENTIALS = require("./credentials.json");
// // Parametros de conexion
// const USER = CREDENTIALS.USER;
// const PASSWORD = CREDENTIALS.PASSWORD;
// const DATA_BASE = "database";
// // Preparando cadena de conexion
// const CONECTOR = `mongodb+srv://${USER}:${PASSWORD}@cluster0.s00yx.mongodb.net/${DATA_BASE}?retryWrites=true&w=majority`;
// const OPTIONS = {useNewUrlParser: true,useUnifiedTopology: true};

// function connectToMongo(){
//     // Abriendo la conexión a mongoDB Atlas
//     connect(CONECTOR, OPTIONS, MongoError => {
//         // si algo sale mal mostramos el error y paramos el servidor
//         if (MongoError) {
//             console.error(MongoError);
//             return false
//         }else{
//             return true
//         }
//     });
// }

// function getByIp(ip:string) : any {
//     let response:any;
//     //Busco segun IP
//     mosaic.find({ip:ip},(error:any, data:any) => {
//         if (error) {
//             // en caso de error mando 404
//             response.status(404);
//             response.json(error);
//         } else {
//             // en caso de que todo salga correcto enviamos la respuesta.
//             response.status(200);
//             response.json(data);
//         }
//         return response;
//     });
// }

// function create(){
//     let response:any;

//     const DATA = {
//         ip: '192.168.0.1',
//         x:12,
//         y:46,
//         color:'black',
//         age:18
//     };
//     const MOSAIC = new mosaic(DATA);
//     MOSAIC.save((error:any, data:any) => {
//         // En caso de error mostramos el problema
//         if (error) {
//             // console.log(error);
//             response.status(404);
//             response.json(error);
//         } else {
//             // en caso de que todo salga correcto enviamos la respuesta.
//             response.status(200);
//             response.json(data); //data
//         }
//         return response;
//     });
// }

// exports.getByIp = getByIp;
// exports.connectToMongo = connectToMongo;
// exports.create = create;

export function getCurrentUnixTime() : number{
    //Busco la hora actual the unix
    let ts:number = Math.round((new Date()).getTime() / 1000);
    return ts;
}

export function oneMinuteDiff(age:number) : boolean{
    //Chequeo que el age del mosaico sea mayor a un minuto
    let currentTime:number = getCurrentUnixTime();
    let diff:number = currentTime - age;
    if (diff >= 60){
        return true
    }else{
        return false
    }
}