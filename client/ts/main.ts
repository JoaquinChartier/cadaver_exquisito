//Exquisite corpse
let widthMosaics:number = 115; //Cantidad de mosaicos que conforman el ancho
let heightMosaics:number = 60; //Cantidad de mosaicos que conforman el largo
let mainCollection:any[] = []; //Coleccion donde se almacenan los mosaicos
let serverUrlProd:string = 'https://testing-node-js5.herokuapp.com/'
let serverUrlLocal:string = 'http://localhost:5000/'
let selectedMosaic:Mosaic; //El mosaico seleccionado actualmente
let pusher = new Pusher('17937bd456c256315c27', {cluster: 'mt1'});
let channel = pusher.subscribe('channel-updates');

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
            try {
                const currentId:string = `${element.x}-${element.y}`;
                const currentMosaic:any = document?.getElementById(currentId);
                currentMosaic.setAttribute('style',`background:${element.color}`);
            } catch {
                console.log(`failed to draw: ${element.x}-${element.y}`)
            }
        }
        console.log('DRAW MOSAICS SUCCESFULL');
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
    //Tomo un solo mosaico, PRIMER PASO
    return new Promise((resolve, reject) => {
        let url:string =  serverUrlProd+'buymosaic'
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
        let url:string =  serverUrlProd+'getall';
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
        $('.card').css('display','block'); //lateral-container
    });
}

function buyMosaicFinalStep(){
    //Tomo un segundo mosaico, SEGUNDO PASO
    let colorPicker:any = document?.querySelector('#colorPicker');
    selectedMosaic.color = colorPicker.value;

    buyMosaicFirstStep(JSON.stringify(selectedMosaic))
    .then(data => {
        if (data == 'SUCCESS'){
            console.log(data);
            $('.card').css('display','none'); //lateral-container
        }else{
            console.log(data);
        }
    })
    .catch(err => console.log(err));
}

function drawOneMosaic(mosaicData:any){
    /*Dibujo un solo mosaico, con la data entregada por pusher*/
    let currentId:string = `${mosaicData.x}-${mosaicData.y}`
    let mosaic:any = document?.getElementById(currentId);
    mosaic.setAttribute('style',`background:${mosaicData.color}`);

    mainCollection.push(mosaicData);
    console.log(mainCollection);
}

window.onload = function(){
    drawCanva();
    setListener();
    drawMosaics();

    channel.bind('updates', function(data:any) {
        //console.log(data);
        drawOneMosaic(data.dataToSend);
    });
}