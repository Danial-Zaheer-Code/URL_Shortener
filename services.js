import { pool } from "./dbConfig.js";

const db = []


export async function createRow(url){
    const result = await pool.query(`
        INSERT INTO url_mapper (url)
        VALUES ($1) RETURNING id   
    `,[url]);

    if(result.rowCount <= 0){
        throw new Error("Create Row Failed to Insert");
    }

    return result.rows[0].id;
}

export async function updateBase62(id, shortened_url){
    const result = await pool.query(`
        UPDATE url_mapper
        SET shortened_url = $1
        WHERE id = $2
    `,[shortened_url,id]); 
}

export async function getOriginalLink(shortened_url){
    const {rows} = await pool.query(`
        SELECT url FROM url_mapper WHERE shortened_url = $1
    `,[shortened_url]);
    
    return rows;
}