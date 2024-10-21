import express from "express"
const app = express();
const PORT = 3001;

// Configurar el middleware para analizar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Ruta para mostrar un formulario HTML simple
app.get('/', (req, res) => {
    res.send(`
        <form action="/submit" method="POST">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name">
            <button type="submit">Enviar</button>
        </form>
    `);
});

// Ruta para manejar el envío del formulario
app.post('/submit', (req, res) => {
    const { name } = req.body;
    res.send(`Nombre recibido: ${name}`);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
