const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config'); //VARIABLES GLOBALES!

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());



app.get("/usuario", (req, res) => {
    res.json("MÉTODOGET");
});

app.post("/usuario", (req, res) => {
    // res.json("MÉTODOPOST");

    let body = req.body;

    if(body.nombre === ""){
        /* 
        Acá usamos el status para envíar el código de respuesta
        además aplicamos un json() que nos permitirá enviarle información al usuario */

        res.status(400).json({
            ok: false,
            comment: "Es necesario llenar el campo del nombre"
        }) 

    }else {
        res.status(200).json({
            ok: true,
            comment: "Se pudo crear el usuario, tiene los datos completos",
            persona: body
        });
    }

});

app.put("/usuario/:id", (req, res) => {

    let identificador = req.params.id
    res.json({
        id: identificador
    });
});

app.delete("/usuario", (req, res) => {
    res.json("MÉTODODELETE");
});



app.listen(process.env.PORT, () => {
    console.log("EscuchandoPuerto", process.env.PORT);
});