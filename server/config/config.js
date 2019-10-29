

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
    urlDataBase = process.env.MONGO_URI;
}

process.env.URLDB = urlDataBase;


// ====================
// VENCIMIENTO DE TOKEN
//====================

process.env.CADUCIDAD_TOKEN =  60 * 60 * 24 * 30;


// ====================
// SEMILLA DE AUTENTICACIÓN
//====================

process.env.SEMILLA = process.env.SEMILLA || 'seed-desarrollo';