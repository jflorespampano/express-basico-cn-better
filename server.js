import express from "express"
import dotenv from 'dotenv'
import path from "path"
import { getAll,create } from "./model.personas.js";

dotenv.config() //cargar las variables de entorno del archivo .env en process.env
const PORT=process.env.PORT || 3000 //cargar el numeo de puerto
const mydb=process.env.SQLITE_DB || 'mydb.sqlite3'

const app=express()
//middleware para  procesar parametros url-encode
app.use(express.urlencoded({ extended: true }));
//middleware para  procesar parametros json
app.use(express.json())
//middleware para  procesar parametros text
app.use(express.text())
// Static files
app.use(express.static(path.join(process.cwd(), 'public')));

//rutas html
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

        O puede llenar este formulario que envia por el método url-encode
        </pre>
        <form id="jsonForm">
            <label for="name">Nombre:</label>
            <input type="text" name="first_name">
            <label for="name">Apellidos:</label>
            <input type="text" name="last_name">
            <label for="name">Sexo:</label>
            <input type="text" name="sexo">
            <label for="name">Edad:</label>
            <input type="text" name="edad">
            <button type="submit">Enviar</button>
        </form>
        <script>
            document.getElementById('jsonForm').addEventListener('submit', function(event) {
                event.preventDefault();
                //const name = document.getElementById('name').value;
                const form = document.getElementById('jsonForm');
                const formData = new FormData(form);
                const jsonData = JSON.stringify(Object.fromEntries(formData));
                fetch('/insert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: jsonData
                })
                .then(response => response.text())
                .then(data => alert(data))
                .catch(error => console.error('Error:', error));
            });
        </script>
        `
    )
})
app.get("/index",(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

//rutas api
app.get('/getAll',(req,res)=>{
    const resp=getAll(mydb)
    res.set({"content-type":"application/json"})
    res.send(JSON.stringify(resp))
})
//parametros en la url
//espera una url asi: http://localhost:3000/get/id
app.get("/get/:id",(req,res)=>{
    //params almacena los  parametros enviados por la url
    console.log(req.params)
    res.set({"content-type":"text/html; charset=utf-8"})
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
    res.set({"content-type":"text/html; charset=utf-8"})
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
    res.set({"content-type":"text/html; charset=utf-8"})
    res.send(
        `
        <h2>Respuesta de la inserción POST :${rjson}</h2>
        `
        )
})
app.put('/put',(req,res)=>{
    console.log(req.body)
    res.set({"content-type":"text/html; charset=utf-8"})
    res.send(
        `
        <h2>Hola modificacion de todos los datos</h2>
        `
        )
})
app.patch('/patch',(req,res)=>{
    console.log(req.body)
    res.set({"content-type":"text/html; charset=utf-8"})
    res.send(
        `
        <h2>Hola modificacion paarcial</h2>
        `
        )
})

//espera id comom parametro query: http://localhost:3000/delete?id=779
app.delete('/delete',(req,res)=>{
    console.log(req.query)
    res.set({"content-type":"text/html; charset=utf-8"})
    res.send(
        `
        <h2>Hola recibiendo con DELETE un id=${req.query.id}</h2>
        `
        )
})

app.listen(PORT,()=>{
    console.log(`iniciando express desde: http://localhost:${PORT}/`)
})