// MIDDLEWARE PERSONALIZADO: VERIFICACIÓN DEL TOKEN

const jwt = require('jsonwebtoken');
//====================
// VERIFICA TOKEN: REQ, RES, NEXT (PARÁMETROS)
//====================
let verificaToken = (req, res, next) => {

    let token = req.get('token'); //OBTENEMOS EL ATRIBUTO TOKEN DE LA PETICIÓN GET

    jwt.verify(token, process.env.SEMILLA, (error, decoded) => {

        if (error) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;


    });
    next();

};

//====================
// VERIFICA ADMIN_ROLE: REQ, RES, NEXT (PARÁMETROS)
//====================

let verificaRol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();

    } else {

        return res.status(400).json({
            ok: false,
            message: "El usuario no es admin"
        });

    }

}

//====================
// VERIFICA TOKEN: REQ, RES, NEXT (PARÁMETROS)
//====================

let verificaTokenImagen = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEMILLA, (error, decoded) => {

        if (error) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();


    });

}


module.exports = {
    verificaToken,
    verificaRol,
    verificaTokenImagen
}