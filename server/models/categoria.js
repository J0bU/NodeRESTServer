// =======================================
// MODELO DE CATEGORIAS USANDO MONGOOSE
// ========================================

const mongoose = require('mongoose');

//LIBRERÍA QUE NOS PERMITE VALIDAR UN CAMPO ÚNICO:
// INSTRUCCIONES: 
//                  1. DEFINIR EL CAMPO UNIQUE: TRUE
//                  2. ESPECIFICAR EL PLUGIN AL ESQUEMA CREADO
const uniqueValidator = require('mongoose-unique-validator');

// DEFINIMOS EL OBJETO SCHEMA QUE USA MONGOOSE
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    descripcion: {

        type: String,
        required: [true, "El nombre de categoría es obligatorio"],
        unique: true
    },

    usuario: {

        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});


// ESPECIFICACIÓN AL ESQUEMA CREADO CON UNIQUEVALIDATOR
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
//EXPORTAMOS EL MODELO PARA SER USADO POR MONGODB

module.exports = mongoose.model('Categoria', categoriaSchema);