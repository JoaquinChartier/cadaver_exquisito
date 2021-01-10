// importando dependencias y credenciales
const Express = require("express");
const { connect } = require("mongoose");
const { mosaic } = require("./schema.js");
const CREDENTIALS = require("./credentials.json");
const FUNCTIONS = require("./functions.js");
const Server = Express();

// Parametros de conexion
const USER = CREDENTIALS.USER;
const PASSWORD = CREDENTIALS.PASSWORD;
const DATA_BASE = "database";
const CONECTOR = `mongodb+srv://${USER}:${PASSWORD}@cluster0.s00yx.mongodb.net/${DATA_BASE}?retryWrites=true&w=majority`;
const OPTIONS = {useNewUrlParser: true,useUnifiedTopology: true};

// Server.use("/checkvacancy", (request, response) => {
//     let ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
//     // let body = JSON.parse(request);
//     // body = body.body;
//     // Chequea si el mosaic esta disponible
//     response = FUNCTIONS.getByIp(ipAddress);
// });

Server.use("/getbyip", (request, response) => {
    //Busco segun IP
    mosaic.find({ip:'192.168.0.1'},(error, data) => {
        if (error) {
            // en caso de error mando 404
            response.status(404);
            response.json(error);
        } else {
            // en caso de que todo salga correcto enviamos la respuesta.
            response.status(200);
            response.json(data);
        }
    });
});

Server.use("/create", (request, response) => {
    let ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const DATA = {
        ip: 'kokokokokko',
        x:12,
        y:46,
        color:'black',
        age:18
    };
    const MOSAIC = new mosaic(DATA);
    MOSAIC.save((error, data) => {
        // En caso de error mostramos el problema
        if (error) {
            // console.log(error);
            response.status(404);
            response.json(error);
        } else {
            // en caso de que todo salga correcto enviamos la respuesta.
            response.status(200);
            response.json(data); //data
        }
    });
});

Server.use("/getmosaic", (request, response) => {
    //Extraigo la IP
    let ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    //Hago la busqueda
    mosaic.find({ip:ipAddress})
    .then((data, error) => {
        if (error) {
            // en caso de error mando 404
            response.status(404);
            response.json(error);
        } else {
            //existen registros, debo chequear si alguno de esos fue reciente
            if(data.length > 0){
                let bool = true; //flag
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    //Chequeo la edad del mosaico que le pertenece a la IP
                    if(!FUNCTIONS.oneMinuteDiff(element.age)){
                        //No hay mas de un minuto, no puedo tomar otro mosaico
                        bool = false
                        break;
                    };
                }
                if(bool){
                    //PUEDE ACCEDER A OTRO MOSAICO

                }else{
                    //NO PUEDE ACCEDER AL MOSAICO

                }
            }else{
                //No existen registros, puedo acceder al mosaico
                
            }
        }
    });
});

// // Router para crear datos de manera aleatoria
// Server.use("/random", (request, response) => {
//     // Se consiguen los nodos del archivo FakeData
//     const { names, lastNames } = FakeData;
//     // Consiguiendo un index de manera aleatoria
//     const NAME = Math.floor(Math.random() * (names.length - 0));
//     const LAST_NAME = Math.floor(Math.random() * (lastNames.length - 0));
//     // Preparando los datos que seran enviados a mongodb
//     const DATA = {
//         name: names[NAME],
//         lastName: lastNames[LAST_NAME],
//         age: NAME * 2,
//         random: NAME * LAST_NAME
//     };

//     // Se indica que se crea un nuevo registro
//     const AGENDA = new agenda(DATA);

//     // Se recibe la respuesta generada al crear un nuevo registro.
//     AGENDA.save((error, data) => {
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
//     });
// });

// // Routere para consultar todos los datos generados.
// Server.use("/", (request, response) => {
//     // Generamos una busqueda completa.
//     agenda.find({}, (error, data) => {
//         // En caso de error mostramos el problema
//         if (error) {
//             response.status(404);
//             response.json(error);
//         } else {
//              // en caso de que todo salga correcto enviamos la respuesta.
//             response.status(200);
//             response.json('empty request'); //data
//         }
//     });
// });

// Abriendo la conexión a mongoDB Atlas
connect(CONECTOR, OPTIONS, MongoError => {
        // si algo sale mal mostramos el error y paramos el servidor
        if (MongoError) {
            console.error(MongoError);
            process.exit(1);
        }
        // se inicia el servidor
        Server.listen(8080, error => {
            // En caso de error indicamos el problemas
            if (error) {
                console.error(error);
                process.exit(1);
            }
            console.log("Conexión establecida, ir a: 'http://localhost:8080/'");
        });
    }
);