
// =======================================
// RUTA DE USUARIOS (POST, GET, PUT Y DELETE)
// ========================================
const express = require('express');

//LIBRERÍA QUE NOS PERMITE CIFRAR LA CONTRASEÑA EN ESTE CASO HACER COMPARACIÓN CON LA CONTRASEÑA QUE VIENE
const bcrypt = require('bcrypt');

//LIBRERÍA QUE NOS PERMITE GENERAR UN JSON WEB TOKEN PARA LA VALIDACIÓN DE CREDENCIALES.
const jwt = require('jsonwebtoken');

// NECESITAMOS EL MODELO PARA PODER OBTENER LA INFORMACIÓN DE ESTE, COMO USUARIO Y PASSWORD
const Usuario = require('../models/usuario');

//ES NECESARIA PARA PODER EJECUTAR LOS MÉTODOS DE LAS RUTAS
const app = express();

//EL POST ES EL QUE RECIBE LA INFORMACIÓN Y LA ENVÍA PARA SER VERIFICADA
app.post("/login", (req, res) => {

    let body = req.body; //CORREO Y PASSWORD (LO QUE VIENE POR POST)

    //BUSCAMOS EL USUARIO DEL ESQUEMA QUE CUMPLA CON LA CONDICIÓN
    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {

        if (error) {
            return res.status(500).json({ //SE EJECUTA SÓLO SI EXISTE ALGÚN PROBLEMA DE EXCEPCIÓN CON LA DB
                ok: false,
                error: error
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({ // SI NO EXISTE EL USUARIO 
                ok: false,
                message: "(Usuario) o contraseña incorrectos"
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { //PARAMETROS: VALOR QUE VIENE VS VALIR DEL USUARIO
            return res.status(400).json({ // EN CASO DE QUE LA CONTRASEÑA SEA INCORRECTA
                ok: false,
                message: "Usuario o (contraseña) incorrectos"
            });
        }

        //ACÁ SE REALIZA LA DEFINICIÓN DEL TOKEN PARA POSTERIORMENTE ENVIAR COMO RESPUESTA
        //PARÁMETROS DE LA LIBRERÍA: INFORMACIÓN Y SEED
        //PARÁMETRO EXPIRESIN: SEGUNDOS, MINUTOS, HORAS, DÍAS (EXPIRARÁ EN 30 DÍAS)
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEMILLA , { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({ //EN CASO DE QUE TODO ESTÉ CORRECTO
            ok: true,
            usuario: usuarioDB,
            token
        });

    });


});


module.exports = app;