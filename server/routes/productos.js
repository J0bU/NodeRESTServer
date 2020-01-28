// ============================
// PRODUCTOS !!
// ============================

const express = require('express');

const { verificaToken, verificaRol } = require('../middlewares/autenticacion');

const app = express();

const Producto = require("../models/producto");


// ============================
// OBTIENE PRODUCTOS
// ============================
app.get('/producto', verificaToken, (req, res) => {
    // OBTENER TODOS LOS PRODUCTOS
    //POPULATE USUARIO CATEGORÍA
    //PAGINADO

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .exec((error, productoDB) => {

            if (error) {
                res.status(500).json({
                    ok: false,
                    error: error
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });


        });


});

// ============================
// OBTIENE PRODUCTOS POR ID
// ============================
app.get('/producto/:id', verificaToken, (req, res) => {

    let identificador = req.params.id;

    Producto.findById(identificador, (error, productoDB) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    error: error
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');

});



// ============================
// BUSCA PRODUCTOS
// ============================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((error, productoDB) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// ============================
// CREA PRODUCTOS
// ============================

app.post('/producto', [verificaToken, verificaRol], (req, res) => {

    let body = req.body;

    let producto = new Producto({

        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id


    });

    producto.save((error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });


});


app.put('/producto/:id', [verificaToken, verificaToken], (req, res) => {

    let identificador = req.params.id;
    let body = req.body;

    Producto.findById(identificador, (error, productoDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }

        //VERIFICAR DESPUES!

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precio;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((error, productoGuardado) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });


    });

});


// ============================
// ELIMINA PRODUCTOS
// ============================

app.delete('/producto/:id', [verificaToken, verificaRol], (req, res) => {

    let identificador = req.params.id;

    Producto.findById(identificador, (error, productoDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }

        productoDB.disponible = false;

        productoDB.save((error, productoBorrado) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado
            });

        });

    });
});



module.exports = app;