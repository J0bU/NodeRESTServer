
// =======================================
// RUTA DE USUARIOS (POST, GET, PUT Y DELETE)
// ========================================
const express = require('express');

//LIBRERÍA QUE NOS PERMITE CIFRAR LA CONTRASEÑA EN ESTE CASO HACER COMPARACIÓN CON LA CONTRASEÑA QUE VIENE
const bcrypt = require('bcrypt');

//LIBRERÍA QUE NOS PERMITE GENERAR UN JSON WEB TOKEN PARA LA VALIDACIÓN DE CREDENCIALES.
const jwt = require('jsonwebtoken');

// LIBRERÍAS DE GOOGLE PARA AUTENTICACIÓN.
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// CONFIGURACIONES DE GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    
    //POR MEDIO DE PAYLOAD VAMOS A OBTENER LOS DATOS DEL USUARIO DE GOOGLE

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
     
  }
  
// YA QUE ESTAMOS TOMANDO EL OBJETO GOOGLEUSER QUE ES RETORNADO POR UNA PROMESA
// PARA OBTENER LOS VALORES DIRECTAMENTE YA QUE ES PROMESA USAMOS LA PALABRA RESERVADA AWAIT
// DE IGUAL FORMA DEBEMOS MANEJAR LA PARTE DEL ASYNC PARA QUE ESTO SE PUEDA USAR.
app.post("/google", async (req, res) => {

    let token = req.body.idtoken;

   let googleUser = await verify(token)
   .catch(error => {
       res.status(403).json({
           ok: false,
           error: error
       });
   });

   // FINDONE LO QUE HACE ES BUSCAR EN EL ESQUEMA USUARIOS SI EXISTE ALGÚN USUARIO CON LAS CREDENCIALES
   //QUE LE HEMOS PASADO.
   Usuario.findOne( {email: googleUser.email}, (error, usuarioDB) => {

    if(error){
        res.status(500).json({
            ok: false,
            error: error
        });
    };

    if(usuarioDB){ // SI EL USUARIO EXISTE COMPROBAMOS QUE NO ESTÉ AUTENTICADO POR GOOGLE

        if(usuarioDB.google === false){
            res.status(400).json({
                ok: false,
                error: {
                    message: "Debe usar autenticación normal"
                }
            });
        }else{
           let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEMILLA , { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });

        }
    }else{
        // SI EL USUARIO NO EXISTE EN NUESTRA BASE DE DATOS
        // ES DECIR, ES LA PRIMERA VEZ QUE SE AUTENTICA

        let usuario = new Usuario();

        usuario.nombre = googleUser.nombre;
        usuario.email   = googleUser.email;
        usuario.img = googleUser.picture;
        usuario.google = true;
        usuario.password = ':)';

        usuario.save(error, usuarioDB => {

            if(error){
                res.status(400).json({
                    ok: false,
                    error: error
                });
            };

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEMILLA , { expiresIn: process.env.CADUCIDAD_TOKEN });
    
            return res.json({
                ok: true,
                usuario: usuarioDB,
                token: token
            });

        });
    }
});

});


module.exports = app;