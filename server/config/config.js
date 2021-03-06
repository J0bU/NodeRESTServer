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

if (process.env.NODE_ENV === 'dev') {
    urlDataBase = 'mongodb://localhost:27017/cafe';
} else {
    urlDataBase = process.env.MONGO_URI;
}

process.env.URLDB = urlDataBase;


// ====================
// VENCIMIENTO DE TOKEN
//====================

process.env.CADUCIDAD_TOKEN = '48h';


// ====================
// SEMILLA DE AUTENTICACIÓN
//====================

process.env.SEMILLA = process.env.SEMILLA || 'seed-desarrollo';

// ====================
// GOOGLE CLIENT ID
//====================

process.env.CLIENT_ID = process.env.CLIENT_ID || "533922305897-nvfg8qr30vvp3lubfuqbe010vu49bpsj.apps.googleusercontent.com";