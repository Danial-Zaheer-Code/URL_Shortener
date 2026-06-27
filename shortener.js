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

export async function shorten(url){
    let id = await createRow(url);
    let shortened_url = convertToBase62(id);    
    await updateBase62(id, shortened_url);

    return shortened_url;
}