"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneMinuteDiff = exports.getCurrentUnixTime = exports.baseResponse = void 0;
exports.baseResponse = {
    status: "",
    reason: "",
    message: ""
};
function getCurrentUnixTime() {
    let ts = Math.round((new Date()).getTime() / 1000);
    return ts;
}
exports.getCurrentUnixTime = getCurrentUnixTime;
function oneMinuteDiff(age) {
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
