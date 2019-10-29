// =======================================
// MODELO DE USUARIOS USANDO MONGOOSE
// ========================================

const mongoose = require('mongoose');

//LIBRERÍA QUE NOS PERMITE VALIDAR UN CAMPO ÚNICO:
// INSTRUCCIONES: 
//                  1. DEFINIR EL CAMPO UNIQUE: TRUE
//                  2. ESPECIFICAR EL PLUGIN AL ESQUEMA CREADO
const uniqueValidator = require('mongoose-unique-validator');

// DEFINIMOS EL OBJETO SCHEMA QUE USA MONGOOSE
let Schema = mongoose.Schema;

// RolesValidos ES UNA ENUMERACIÓN QUE NOS PERMITE DEFINIR LOS ÚNICOS POSIBLES VALORES QUE TIENE
// UN CAMPO EN UN ESQUEMA, EN NUESTRO CASO NECESITAMOS SÓLO DOS VALORES PARA EL ROL DEL USUARIO 
// QUE SON USER_ROLE Y ADMIN_ROLE
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

//EL ESQUEMA CREADO CON USUARIOSCHEMA ES BÁSICAMENTE DEFINIR LOS CAMPOS QUE TENDRÁ NUESTRA TABLA
// USUARIOS, ES DECIR, NOMBRE, APELLIDO, EDAD, ETC...

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "ES OBLIGATORIO EL NOMBRE"]
    },
    email: {
        type: String,
        required: [true, "ES OBLIGATORIO EL EMAIL"],
        unique: true // ÚNICO CORREO ELECTRÓNICO EN LA BASE DE DATOS
    },
    password: {
        type: String,
        required: [true, "ES OBLIGATORIA LA CONTRASEÑA"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

// QUITAR UN CAMPO DE LA RESPUESTA A LA PETICIÓN, EN ESTE CASO LA CONTRASEÑA
// EN LA BD SÍ SE CREA LA CONTRASEÑA PORQUE Y LOS DEMÁS VALORES, YA QUE ESTOS SE GUARDAN
// ANTES DE QUE SE HAGA LA RESPUESTA, LA PASSWORD SÓLO SE ELIMINA EN LA RESPUESTA A LA PETICIÓN.
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// ESPECIFICACIÓN AL ESQUEMA CREADO CON UNIQUEVALIDATOR
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});
//EXPORTAMOS EL MODELO PARA SER USADO POR MONGODB

//EN ESTE CASO EL MODELO ES LLAMADO Usuario, QUE TOMARÁ LAS CARACTERÍSTICAS DE USUARIOSCHEMA
module.exports = mongoose.model('Usuario', usuarioSchema);