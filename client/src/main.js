"use strict";
let widthMosaics = 115;
let heightMosaics = 60;
let mainCollection = [];
let serverUrlProd = 'https://testing-node-js5.herokuapp.com/';
let serverUrlLocal = 'http://localhost:5000/';
let selectedMosaic;
let pusher = new Pusher('17937bd456c256315c27', { cluster: 'mt1' });
let channel = pusher.subscribe('channel-updates');
class Mosaic {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}
function drawCanva() {
    let str = '';
    let widthCount = 0;
    let heightCount = 0;
    for (let i = 0; i < heightMosaics; i++) {
        widthCount = 0;
        str += `<div id="row${i}" class="row">`;
        for (let e = 0; e < widthMosaics; e++) {
            str += `<div id="${widthCount}-${heightCount}" class="mosaic"></div>`;
            widthCount += 1;
        }
        str += '</div>';
        heightCount += 1;
    }
    $('#mainDiv').html(str);
}
async function drawMosaics() {
    getAllMosaics()
        .then(() => {
        console.log(mainCollection);
        for (let i = 0; i < mainCollection.length; i++) {
            const element = mainCollection[i];
            try {
                const currentId = `${element.x}-${element.y}`;
                const currentMosaic = document === null || document === void 0 ? void 0 : document.getElementById(currentId);
                currentMosaic.setAttribute('style', `background:${element.color}`);
            }
            catch {
                console.log(`failed to draw: ${element.x}-${element.y}`);
            }
        }
        console.log('DRAW MOSAICS SUCCESFULL');
    })
        .catch(err => console.log(err));
}
function basicRequest(mode, body, fullURL) {
    return new Promise((resolve, reject) => {
        let settings = {
            "url": fullURL,
            "method": mode,
            "timeout": 0,
            "mode": 'no-cors',
            "data": body,
            "crossorigin": true,
            "headers": { "Content-Type": "application/json" },
        };
        $.ajax(settings)
            .done(data => resolve(data))
            .catch(err => reject(err));
    });
}
function buyMosaicFirstStep(body) {
    return new Promise((resolve, reject) => {
        let url = serverUrlProd + 'buymosaic';
        basicRequest('POST', body, url)
            .then(data => {
            resolve(data);
        })
            .catch(err => reject(err));
    });
}
function getAllMosaics() {
    return new Promise((resolve, reject) => {
        let url = serverUrlProd + 'getall';
        basicRequest('POST', '', url)
            .then(data => {
            mainCollection = data;
            resolve('OK');
        })
            .catch(err => reject('failed to fetch all: ' + err));
    });
}
function setListener() {
    $('div .mosaic').on('click', (e) => {
        let x = Number(e.target.id.split('-')[0]);
        let y = Number(e.target.id.split('-')[1]);
        let color = "";
        selectedMosaic = new Mosaic(x, y, color);
        $('.card').css('display', 'block');
    });
}
function buyMosaicFinalStep() {
    let colorPicker = document === null || document === void 0 ? void 0 : document.querySelector('#colorPicker');
    selectedMosaic.color = colorPicker.value;
    buyMosaicFirstStep(JSON.stringify(selectedMosaic))
        .then(data => {
        if (data == 'SUCCESS') {
            console.log(data);
            $('.card').css('display', 'none');
        }
        else {
            console.log(data);
        }
    })
        .catch(err => console.log(err));
}
function drawOneMosaic(mosaicData) {
    let currentId = `${mosaicData.x}-${mosaicData.y}`;
    let mosaic = document === null || document === void 0 ? void 0 : document.getElementById(currentId);
    mosaic.setAttribute('style', `background:${mosaicData.color}`);
    mainCollection.push(mosaicData);
    console.log(mainCollection);
}
window.onload = function () {
    drawCanva();
    setListener();
    drawMosaics();
    channel.bind('updates', function (data) {
        drawOneMosaic(data.dataToSend);
    });
};
