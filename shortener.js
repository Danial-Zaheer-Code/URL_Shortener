import {createRow, updateBase62, getOriginalLink} from "./services.js"

const DICT = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const db = []

function convertToBase62(num){
    let res = '';
    while(num != 0){
        const r = num % 62;
        num = Math.trunc(num / 62);

        res += DICT[r];
    }

    return res;
}

export function shorten(url){
    let id = createRow(url);
    let res = convertToBase62(id);    
    updateBase62(id, res);

    return res;
}