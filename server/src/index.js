// importando dependencias y credenciales
const Express = require("express");
const { connect } = require("mongoose");
const bodyParser = require("body-parser");
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

// configuramos la app para que use bodyParser(), esto nos dejara usar la informacion de los POST
Server.use(bodyParser.urlencoded({ extended: true }));
Server.use(bodyParser.json());

Server.post("/getmosaic", (request, response) => {
    //Extraigo la IP
    let ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    //Armo el request
    let AUXDATA = {
        ip: ipAddress,
        x:request.body.x,
        y:request.body.y,
        color:request.body.color,
        age:FUNCTIONS.getCurrentUnixTime()
    };
    //console.log('edad data: ',AUXDATA.age)
    //Busco si la persona tiene mosaicos
    mosaic.find({ip:ipAddress})
    .then((data, error) => {
        if (error) {
            // en caso de error mando 404
            response.status(404);
            response.json(error);
        } else {
            //Si este PARM esta en true puede acceder a otro mosaico
            let canGetMosaic = false
            if(data.length > 0){
                //existen registros de mosaicos, debo chequear si alguno de esos fue reciente
                let bool = true; //flag
                for (let i = 0; i < data.length; i++) {
                    //Chequeo la edad del mosaico que le pertenece a la IP
                    if(!FUNCTIONS.oneMinuteDiff(data[i].age)){
                        //No hay mas de un minuto, NO puedo tomar otro mosaico
                        console.log('No hay mas de un minuto de dif')
                        bool = false
                        break;
                    };
                }
                if(bool){
                    //PUEDE ACCEDER A OTRO MOSAICO
                    console.log('Puede acceder a otro mosaico')
                    canGetMosaic = true
                }else{
                    //NO PUEDE ACCEDER AL MOSAICO, porque uno de esos mosaicos es reciente
                    console.log('No puede acceder, porque uno de sus mosaicos es reciente')
                    canGetMosaic = false
                }
            }else{
                //No existen registros, puedo acceder al mosaico
                console.log('puede acceder, todavia no tiene mosaicos')
                canGetMosaic = true
            }
            //Puede acceder al mosaico
            if (canGetMosaic){
                //PRIMERO CHEQUEO QUE EL MOSAICO NO ESTE OCUPADO YA
                mosaic.find({x:AUXDATA.x, y:AUXDATA.y})
                .then((data, error) => {
                    console.log('data',data)
                    if (error) {
                        // en caso de error mando 404
                        response.status(404);
                        response.json(error);
                    } else {
                        if (!(data.length > 0)){
                            //Si no tiene datos, puede tomar el mosaico, lo guardo a la DB
                            const NEW_MOSAIC = new mosaic(AUXDATA);
                            NEW_MOSAIC.save((error, data) => {
                                if (error) {
                                    response.status(404);
                                    response.json(error);
                                } else {
                                    console.log('toma el mosaico, success')
                                    response.status(200);
                                    response.json('SUCCESS');
                                }
                            });
                        }else{
                            console.log('el mosaico esta ocupado chequeo edad')
                            //El mosaico ya esta ocupado, chequeo la edad
                            let can = FUNCTIONS.oneMinuteDiff(data[0].age);
                            if(can){
                                console.log('edad mosaico a ocupar',data[0].age)
                                //HAY MAS DE UN MINUTO, puedo tomar el mosaic
                                const NEW_MOSAIC = new mosaic(AUXDATA);
                                NEW_MOSAIC.save((error, data) => {
                                    if (error) {
                                        response.status(404);
                                        response.json(error);
                                    } else {
                                        console.log('le otorgo el mosaico')
                                        response.status(200);
                                        response.json('SUCCESS');
                                    }
                                });
                            }else{
                                //No hay mas de un minuto, NO puedo tomar otro mosaico
                                console.log('no hay mas de un minuto, no le doy el mosaic')
                                response.status(200);
                                response.json('REJECTED');
                            };
                        }
                    }
                });
            }else{
                //NO PUEDE ACCEDER A OTRO MOSAICO
                console.log('no puede acceder a otro mosaico')
                response.status(200);
                response.json('REJECTED');
            }
        }
    });
});

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