// =======================================
// RUTA DE USUARIOS (POST, GET, PUT Y DELETE)
// ========================================
const express = require('express');

//LIBRERÍA QUE NOS PERMITE CIFRAR LA CONTRASEÑA
const bcrypt = require('bcrypt');

const _ = require('underscore');

// ESTA VARIABLE NOS PERMITE DEFINIR UN OBJETO USUARIO QUE TENDRÁ EL MODELO ESPECIFICADO
// PARA LUEGO GUARDAR EN LA BASE DE DATOS DE MONGODB SIGUIEDO ESTE MODELO
const Usuario = require('../models/usuario'); 

const app = express();


app.get("/usuario", (req, res) => {

    let desde = req.query.desde || 0 ; // VARIABLE DESDE PUEDE VENIR DE LA PETICIÓN GET:
    // EN CASO CONTRARIO TOMARÁ LA VARIABLE DESDE COMO 0.

    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // OBTENER USUARIOS: POR MEDIO DEL ESQUEMA ES QUE PODREMOS OBTENER TODOS LOS USUARIOS.
    Usuario.find({  role: 'USER_ROLE', estado: true}, 'nombre email role estado google img') /* ACÁ DENTRO SE ESPECIFICA LA CONDICIÓN DE BÚSQUEDA */
        .skip(desde) // SALTAMOS LOS PRIMEROS CINCO REGISTROS
        .limit(limite) // PAGINAMOS SÓLAMENTE CINCO REGISTROS
        .exec( (error, usuariosDB) => {

            if(error){
               return  res.status(400).json({
                    ok: false,
                    error: error
                });
            }

            Usuario.count({role: 'USER_ROLE', estado: true}, (error, conteo) => {
                
                res.json({
                    ok: true,
                    usuarios: usuariosDB,
                    cuantos: conteo
                });

            });

        });

});

// MÉTODO POST DE LA API REST

app.post("/usuario", (req, res) => {
    // res.json("MÉTODOPOST");

    let body = req.body;

    //ESTE USUARIO TENDRÁ EL MODELO ESPECIFICADO PARA GUARDAR EN LA BASE DE DATOS
    let usuario = new Usuario({
        nombre:   body.nombre,
        email:    body.email,
        password: bcrypt.hashSync(body.password, 10), //PARÁMETROS: Data, vecesCifrado.
        role:     body.role
    });

    // GUARDAR EN LA BASE DE DATOS
    usuario.save( (error, usuarioDB) => {
        // RECIBIMOS UN ERROR Y UN Usuario, EN ESTE CASO ES EL USUARIO QUE CRAMOS CON LOS CAMPOS QUE RECIBIMOS
        // SI TENEMOS ALGÚN ERROR RETORNAMOS EL BAD REQUEST Y MOSTRAMOS EL ERROR
        if(error) {
            return res.status(400).json({
            ok: false,
            error: error
         });
      }

      // SI RECIBIMOS TODOS LOS PARÁMETROS ENTONCES MOSTRAMOS EL USUARIO CREADO

        res.status(200).json({
          ok: true,
          usuario: usuarioDB
      });

    });
   
});

// MÉTODO PUT DE LA API REST
// SE BUSCARÁ POR EL ID PROPORCIONADO, Y SE USARÁ PARA ACTUALIZAR UN REGISTRO EN LA BD

app.put("/usuario/:id", (req, res) => {

    // SE OBTIENE TANTO EL ID COMO EL CUERPO DE DICHO ID
    let identificador = req.params.id
    let body = _.pick(  req.body, ["nombre", "img","role","estado","email"]);

    

    // USAMOS EL ESQUEMA QUE ESTÁ EN EL OBJETO USUARIO
    // PARÁMETROS: ID, INFORMACIÓN, {DESPLEJAR NUEVA INFORMACIÓN, VALIDACIONES ESQUEMA}, CALLBACK.
    // PARA EVITAR EL PROBLEMA DE ACTUALIZAR CAMPOS QUE NO SON LOS DESEADOS, SE USA LA LIBRERÍA 
    // LLAMADA UNDERSCORE INSTALÁNDOLA COMO NPM INSTALL UNDERSCORE
    Usuario.findByIdAndUpdate(identificador, body, {new: true, runValidators: true},(error, usuarioDB) =>{
        if(error) {
            return res.status(400).json({
            ok: false,
            error: error
         });
      }
      res.json({
        ok: true,
        usuario: usuarioDB
        });
    });
   
});


// MÉTODO DELETE DE LA API REST

app.delete("/usuario/:id", (req, res) => {
    
    //HAY DOS FORMAS DE ELIMINAR UN REGISTRO: FÍSICAMENTE O SÓLO PARCIALMENTE
    //FÍSICAMENTE:
    let identificador = req.params.id;

    //EN ESTE CASO NO TENEMOS BODY YA QUE ESTAMOS TRABAJANDO SIN AYUDA DEL HEADER, ES DECIR,
    //NO TENEMOS EL FIRMWARE QUE AYUDARÁ A OBTENER LOS DATOS DE LA CONSULTA.
    
    let cambiaEstado = {
        estado: false
    }; // CAMPO QUE YO DESEO MODIFICAR, EN ESTE CASO EL ESTADO.

    //Usuario.findByIdAndRemove(identificador, body, (error, usuarioBorrado) => {

    // SE CAMBIARÁ UN ATRIBUTO EN EL USUARIO PARA REPRESENTAR EL ESTADO FALSE (INACTIVO).

    Usuario.findByIdAndUpdate(identificador, cambiaEstado, {new: true} , (error, usuarioBorrado ) => {

        if(error){
            return res.status(400).json({
                ok: false,
                error: error
            });
        }


        if(usuarioBorrado === null){

            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });



});

module.exports = app;