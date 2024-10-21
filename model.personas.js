import Database from "better-sqlite3";
export function getAll(mydb){
    const db = new Database(mydb)
    const query = "select * from personas;"
    const personas = db.prepare(query).all()
    db.close()
    // console.log(personas)
    return (personas)
}

export function get(mydb,id){
    const db = new Database(mydb)
    const query = "select * from personas where id=?;"
    const personas = db.prepare(query).get([id])
    db.close()
    // console.log(personas)
    return(personas)
}
/**
 * 
 * @param {*} mydb nombre del archivo de base de datos sqlite3
 * @param {*} datos {first_name,last_name,sexo,edad}
 * @returns 
 */
export function create(mydb,datos){
    const sql=`
    insert into personas(first_name,last_name,sexo,edad) 
    values(@first_name,@last_name,@sexo,@edad)
    `
    const db = new Database(mydb)
    const insertData=db.prepare(sql)
    // const resp=insertData.run(user.name, user.username)
    const resp=insertData.run(datos)
    db.close()
    return resp
}