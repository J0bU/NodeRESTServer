const express = require('express');

const app = express();


//LIBRERÍA QUE NOS PERMITE MANEJAR LOS ARCHIVOS
const fileUpload = require('express-fileupload');

const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

const fs = require('fs'); // ACCEDER AL FILESYSTEM

const path = require('path'); //SABER LA RUTA EN LA QUE ESTOY


// CARGAR ARCHIVOS A EXPRESS.
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", (req, res) => {

    let tipo = req.params.tipo;
    let identificador = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400).json({
            ok: false,
            error: {
                message: "No se subió ningún archivo"
            }
        });

    }

    // VALIDAR TIPO

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            error: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(',')
            }
        });

    }
    // THE NAME OF THE INPUT FIELD (I.E. "SAMPLEFILE") IS USED TO RETRIEVE THE UPLOADED FILE
    //ARCHIVO: CAMPO QUE VIENE EN POSTMAN
    let archivo = req.files.archivo;

    // EXTENSIONES VÁLIDAS

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            error: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(',')
            }
        });
    }

    // CAMBIAR NOMBRE DE ARCHIVO POR ID USUARIO

    let nombreArchivo = `${identificador}-${new Date().getMilliseconds()}.${extension}`;


    // USE THE MV() METHOD TO PLACE THE FILE SOMEWHERE ON YOUR SERVER
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {

        if (err)
            return res.status(500).json({
                ok: false,
                error: err
            });

        if (tipo === 'usuarios') {

            imagenUsuario(identificador, res, nombreArchivo);
        } else {

            imagenProducto(identificador, res, nombreArchivo);
        }


    });

});

function imagenUsuario(identificador, res, nombreArchivo) {

    Usuario.findById(identificador, (error, usuarioDB) => {

        if (error) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                error: error
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario no existe"
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((error, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });


    });
};

function imagenProducto(identificador, res, nombreArchivo) {

    Producto.findById(identificador, (error, productoDB) => {

        if (error) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                error: error
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario no existe"
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((error, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });


    });


};

function borraArchivo(nombreImagen, tipo) {
    //VERIFICAR LA RUTA DEL ARCHIVO

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
};

//USAR CONFIGURACIÓN FUERA DL ARCHIVO!
module.exports = app;