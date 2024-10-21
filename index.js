import express from "express"
import dotenv from 'dotenv'
import { getAll,create } from "./model.personas.js";

dotenv.config() //cargar las variables de entorno del archivo .env en process.env
const PORT=process.env.PORT || 3001 //cargar el numeo de puerto
const mydb=process.env.SQLITE_DB || 'mydb.sqlite3'

const app=express()
//middleware para  procesar parametros json, url-encode, y texto
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(express.text())

app.get("/",(req,res)=>{
    res.send(
        `
        <h1>Binevenido</h1>
        <h3>Pruebe abrir enta liga en su navegador: http://localhost:${PORT}/getAll</h3>
        <h3>O</h3>
        <h3>Desde Thunder Client pruebe llamar  con POST a: http://localhost:${PORT}/insert</h3>
        <pre>
            Con parametros json
            {
                "first_name":"jose angel",
                "last_name":"perez",
                "sexo":"M",
                "edad":45
            }
            O con parametros en Form-encode envindo:
            Campos          valores
            --------        -------
            first_name      jose angel
            last_name       perez
            sexo            M
            edad            45

        Complete put, patch, delete
        </pre>
        `
    )
})
//
app.get('/getAll',(req,res)=>{
    const resp=getAll(mydb)
    res.set({"content-type":"application/json"})
    res.send(JSON.stringify(resp))
})
//parametros en la url
//espera una url asi: http://localhost:3000/get/id
app.get("/get/:id",(req,res)=>{
    res.set({"content-type":"text/html; charset=utf-8"})
    //params almacena los  parametros enviados por la url
    console.log(req.params)
    res.end(
        `
        <h1>binevenido id=${req.params.id}</h1>
        `
    )
})
//parametros query
//espera:http://localhost:3000/get?id=7
app.get('/get',(req,res)=>{
    const data=req.query
    console.log(data)
    res.send(
        `
        <h1>select por ${data.id}</h1>
        `
    )
})
//parametros en el body
//espera:http://localhost:3000/insert, con un body en formato json o Form-encode
app.post('/insert',(req,res)=>{
    console.log(req.body)
    const datos={
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        sexo:req.body.sexo,
        edad:req.body.edad
    }
    const resp=create(mydb,datos)
    const rjson=JSON.stringify(resp)
    console.log(rjson)
    res.send(
        `
        <h2>Respuesta de la inserción POST :${rjson}</h2>
        `
        )
})
app.put('/put',(req,res)=>{
    console.log(req.body)
    res.send(
        `
        <h2>Hola modificacion de todos los datos</h2>
        `
        )
})
app.patch('/patch',(req,res)=>{
    console.log(req.body)
    res.send(
        `
        <h2>Hola modificacion paarcial</h2>
        `
        )
})

//espera id comom parametro query: http://localhost:3000/delete?id=779
app.delete('/delete',(req,res)=>{
    console.log(req.query)
    res.send(
        `
        <h2>Hola recibiendo con DELETE un id=${req.query.id}</h2>
        `
        )
})

app.listen(PORT,()=>{
    console.log(`iniciando express desde: http://localhost:${PORT}/`)
})