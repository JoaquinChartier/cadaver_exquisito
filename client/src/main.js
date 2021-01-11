"use strict";
let widthMosaics = 100;
let heightMosaics = 60;
let serverUrl = 'http://localhost:8080/';
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
function basic_request(mode, body, fullURL) {
    return new Promise((resolve, reject) => {
        let settings = {
            "url": fullURL,
            "method": mode,
            "timeout": 0,
            "mode": 'no-cors',
            "crossorigin": true,
            "headers": { "Content-Type": "multipart/form-data" },
            "beforeSend": function (xhr) { xhr.withCredentials = true; }
        };
        $.ajax(settings)
            .done(data => resolve(data))
            .catch(err => reject(err));
    });
}
window.onload = function () {
    drawCanva();
    $('div .mosaic').on('click', (e) => {
        let mosaic = document.getElementById(e.target.id);
        mosaic.setAttribute('style', 'background:black');
    });
};
