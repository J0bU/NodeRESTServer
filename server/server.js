const express = require('express');
const app = express();

//OBTIENE EL CUERPO DE LAS PETICIONES MIDDLEWARE
const bodyParser = require('body-parser');

//LIBRERÍA QUE NOS PERMITE CONECTARNOS A MONGODB Y GENERAR ESQUEMAS
const mongoose = require('mongoose');

const path = require('path');
require('./config/config'); //VARIABLES GLOBALES!

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//HABILITAR LA CARPETA PUBLIC

app.use(express.static(path.resolve(__dirname, '../public')));

// NOS PERMITE USAR LA RUTA DE USUARIO QUE ESTÁ EN LA RUTA routes/usuario
app.use(require('./routes/index'));


// USANDO EXPRESS PARA EL PUERTO, ES DECIR, ACÁ TENEMOS LA ESCUCHA AL PUERTO LOCAL 

app.listen(process.env.PORT, () => {
    console.log("EscuchandoPuerto", process.env.PORT);
});

// CONEXIÓN A LA BASE DE DATOS POR MEDIO DE MONGOOSE

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (error, resp) => {
    if (error) throw error;
    else console.log("DB ONLINE");
});