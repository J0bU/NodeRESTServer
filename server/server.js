const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./config/config'); //VARIABLES GLOBALES!

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// NOS PERMITE USAR LA RUTA DE USUARIO QUE ESTÁ EN LA RUTA routes/usuario
app.use(require('./routes/usuario'));


// USANDO EXPRESS PARA EL PUERTO, ES DECIR, ACÁ TENEMOS LA ESCUCHA AL PUERTO LOCAL 

app.listen(process.env.PORT, () => {
    console.log("EscuchandoPuerto", process.env.PORT);
});

// CONEXIÓN A LA BASE DE DATOS POR MEDIO DE MONGOOSE

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:  true
}, (error, resp) => {
    if(error) throw error;
    else console.log("DB ONLINE");
});