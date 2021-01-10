"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneMinuteDiff = exports.getCurrentUnixTime = void 0;
function getCurrentUnixTime() {
    //Busco la hora actual the unix
    let ts = Math.round((new Date()).getTime() / 1000);
    return ts;
}
exports.getCurrentUnixTime = getCurrentUnixTime;
function oneMinuteDiff(age) {
    //Chequeo que el age del mosaico sea mayor a un minuto
    let currentTime = getCurrentUnixTime();
    let diff = currentTime - age;
    if (diff >= 60) {
        return true;
    }
    else {
        return false;
    }
}
exports.oneMinuteDiff = oneMinuteDiff;
