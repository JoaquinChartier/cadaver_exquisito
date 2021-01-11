let widthMosaics:number = 100; //Cantidad de mosaicos que conforman el ancho
let heightMosaics:number = 60; //Cantidad de mosaicos que conforman el largo
let serverUrl:string = 'http://localhost:8080/'; 
//const CREDENTIALS = require("./credentials.json");

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

function basic_request(mode:string, body:string, fullURL:string) : Promise<any> {
    //Basic request
    return new Promise((resolve, reject) => {
        let settings = {
            "url": fullURL,
            "method": mode,
            "timeout": 0,
            "mode":'no-cors',
            "crossorigin": true,
            "headers": { "Content-Type": "multipart/form-data"},
            "beforeSend": function(xhr:any){ xhr.withCredentials = true;}
          };
          $.ajax(settings)
          .done(data => resolve(data))
          .catch(err => reject(err));
    });
}

window.onload = function(){
    drawCanva();

    $('div .mosaic').on('click',(e) => {
        //Capturo el click del en el mosaic 
        let mosaic:any = document.getElementById(e.target.id);
        //console.log(mosaic);
        mosaic.setAttribute('style','background:black');
    });
}