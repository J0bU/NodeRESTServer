const express = require('express');
const fs = require('fs');

const path = require('path');
//ME PERMITE CREAR EL PATH ABOSLUTO DE LA IMAGEN.

const { verificaTokenImagen } = require('../middlewares/autenticacion');

const app = express();




app.get('/imagen/:tipo/:img', verificaTokenImagen, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;


    //BUSCAMOS LA IMAGEN QUE NOS PROPORCIONAN EN LA URL PARA VER SI ESTÁ EN EL REPOSITORIO
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) { // DEVUELVE TRUE SI EXISTE
        res.sendFile(pathImagen);

    } else {

        //OBTENEMOS EL PATH DE LA IMAGEN EN ASSETS
        let imagenRecibidaPath = path.resolve(__dirname, '../assets/Koala.jpg');
        res.sendFile(imagenRecibidaPath);
    }

});




module.exports = app;