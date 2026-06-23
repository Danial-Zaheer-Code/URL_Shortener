
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
    let id = db.length == 0 ? 1 : Math.max(db.map(item => item.id)) + 1;

    let res = convertToBase62(id);    

    db.push({
        id: id,
        base62: res,
        url: url
    })


    return res;
}

export function getOriginalLink(convertedString){
    const result = db.filter(item => item.base62 == convertedString);
    
    return result.length == 0 ? null : result[0].url;
}