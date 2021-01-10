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