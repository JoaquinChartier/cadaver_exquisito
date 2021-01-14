let widthMosaics:number = 100; //Cantidad de mosaicos que conforman el ancho
let heightMosaics:number = 60; //Cantidad de mosaicos que conforman el largo
let mainCollection:any[] = []; //Coleccion donde se almacenan los mosaicos
let serverUrl:string = 'https://testing-node-js5.herokuapp.com/'//'http://localhost:8080/';
let selectedMosaic:Mosaic; //El mosaico seleccionado actualmente
//const CREDENTIALS = require("./credentials.json");

class Mosaic{
    x:number;
    y:number;
    color:string;

    constructor(x:number, y:number, color:string){
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

function drawCanva(){
    /*Dibujo todo el canva, con todos los mosaicos */
    let str:string = '';
    let widthCount:number = 0;
    let heightCount:number = 0;
    for (let i = 0; i < heightMosaics; i++) {
        widthCount = 0;
        str += `<div id="row${i}" class="row">`
        for (let e = 0; e < widthMosaics; e++) {
            str += `<div id="${widthCount}-${heightCount}" class="mosaic"></div>`;
            widthCount += 1;
        }
        str += '</div>'
        heightCount += 1;
    }
    $('#mainDiv').html(str);
}

async function drawMosaics(){
    //Traigo todos los mosaicos y los dibujo en su respectiva posicion
    getAllMosaics()
    .then(() => {
        console.log(mainCollection);
        for (let i = 0; i < mainCollection.length; i++) {
            const element = mainCollection[i];
            const currentId:string = `${element.x}-${element.y}`;
            const currentMosaic:any = document?.getElementById(currentId);
            currentMosaic.setAttribute('style',`background:${element.color}`);
        }
        console.log('DRAW MOSAICS OK');
    })
    .catch(err => console.log(err));
    
}

function basicRequest(mode:string, body:string, fullURL:string) : Promise<any> {
    //Basic request
    return new Promise((resolve, reject) => {
        let settings = {
            "url": fullURL,
            "method": mode,
            "timeout": 0,
            "mode":'no-cors',
            "data": body, //JSON.stringify(
            "crossorigin": true,
            "headers": { "Content-Type": "application/json"},
            //"beforeSend": function(xhr:any){ xhr.withCredentials = true;}
          };
          $.ajax(settings)
          .done(data => resolve(data))
          .catch(err => reject(err));
    });
}

function buyMosaicFirstStep(body:string) : Promise<any>{
    //Tomo un solo mosaico
    return new Promise((resolve, reject) => {
        let url:string =  serverUrl+'buymosaic'
        basicRequest('POST',body,url)
        .then(data => {
            resolve(data);
        })
        .catch(err => reject(err));
    })
}

function getAllMosaics() : Promise<any>{
    //Traigo todos los mosaicos
    return new Promise((resolve, reject) => {
        let url:string =  serverUrl+'getall';
        basicRequest('POST','', url)
        .then(data => {
            mainCollection = data;
            resolve('OK')
        })
        .catch(err => reject('failed to fetch all: '+err));
    })
}

function setListener(){
    $('div .mosaic').on('click',(e) => {
        //Capturo el click en el mosaic 
        let x:number = Number(e.target.id.split('-')[0]);
        let y:number = Number(e.target.id.split('-')[1]);
        let color:string = "";
        selectedMosaic = new Mosaic(x,y,color);
        $('.lateral-container').css('display','flex');
    });
}

function buyMosaicFinalStep(){
    let colorPicker:any = document?.querySelector('#colorPicker');
    selectedMosaic.color = colorPicker.value;

    buyMosaicFirstStep(JSON.stringify(selectedMosaic))
    .then(data => {
        if (data == 'SUCCESS'){
            console.log(data);
            let currentId = `${selectedMosaic.x}-${selectedMosaic.y}`
            let mosaic:any = document?.getElementById(currentId);
            mosaic.setAttribute('style',`background:${selectedMosaic.color}`);
            $('.lateral-container').css('display','none');
        }else{
            console.log(data);
        }
    })
    .catch(err => console.log(err));
}

window.onload = function(){
    drawCanva();
    setListener();
    drawMosaics();
}