// ============================
// CATEGORIAS !!
// ============================

const express = require('express');

const { verificaToken, verificaRol } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require("../models/categoria");


// SERVICIO ENCARGADO DE MOSTRAR TODAS LAS CATEGORÍAS
app.get('/categoria', verificaToken, (req, res) => {

    //APAREZCAN TODAS LAS CATEGORÍAS
    Categoria.find({})
        .sort('descripcion') // ORDENA POR DESCRIPCIÓN ALFABÉTICAMENTE
        .populate('usuario', 'nombre email') //POPULATE ME PERMITE MOSTRAR LOS DATOS A LA REFERENCIA QUE HACE CATEGORÍA
        // ADEMÁS SE PUEDEN ESEPECIFICAR LOS CAMPOS QUE YO DESEO DEL USUARIO
        .exec((error, categorias) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                categorias: categorias
            });
        });

});

// SERVICIO ENCARGADO DE MOSTRAR UNA CATEGORÍA POR ID
app.get('/categoria/:id', verificaToken, (req, res) => {

    let identificador = req.params.id;
    Categoria.findById(identificador, (error, categoriaDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "El ID  no es correcto."
                }

            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});



//SERVICIO ENCARGADO DE REGRESAR UNA NUEVA CATEGORÍA
app.post('/categoria', [verificaToken], (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id // ENVIAMOS EL ID DEL USUARIO PARA SABER CUÁL USUARIO CREÓ LA CATEGORÍA
    });

    categoria.save((error, categoriaDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});


app.put('/categoria/:id', [verificaToken, verificaRol], (req, res) => {

    //LO PRIMERO QUE NECESITAMOS ES EL ID QUE SE ENVIÓ
    let identificador = req.params.id;
    let body = req.body;

    let cambiaDescripcion = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(identificador, cambiaDescripcion, { new: true, runValidators: true, context: 'query' }, (error, categoriaDB) => {

        //LAS CONDICIONES DE VALIDACIÓN SE GENERAN IGUAL QUE COMO SE GENERARON EN EL MÉTODO POST
        if (error) {
            return res.status(500).json({
                ok: false,
                error: error
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

app.delete('/categoria/:id', [verificaToken, verificaRol], (req, res) => {

    let identificador = req.params.id;
    let body = req.body;

    Categoria.findByIdAndRemove(identificador, (error, categoriaDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error: error
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "El ID no existe"
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoría borrada'
        })
    });

});



module.exports = app;