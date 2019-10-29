

// ====================
// PUERTO = DEFINIR VARIABLES GLOBABLES
//====================

process.env.PORT = process.env.PORT || 3000;


// ====================
// ENTORNO 
//====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ====================
// BASE DE DATOS
//====================
let urlDataBase;

if(process.env.NODE_ENV === 'dev'){
    urlDataBase = 'mongodb://localhost:27017/cafe';
}else{
    urlDataBase = 'mongodb+srv://J0bU:1GOvtCLzv135MNQX@cluster0-5oocy.mongodb.net/Cafe'
}

process.env.URLDB = urlDataBase;
