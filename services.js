const db = []


export function createRow(url){
    let id = db.length == 0 ? 1 : Math.max(db.map(item => item.id)) + 1;
    db.push({
        id: id,
        base62: "",
        url: url
    })

    return id;
}

export function updateBase62(id, base62){
    db.map(item => {
        if(item.id == id){
            item.base62 = base62;
        }
    })
}

export function getOriginalLink(convertedString){
    const result = db.filter(item => item.base62 == convertedString);
    
    return result.length == 0 ? null : result[0].url;
}