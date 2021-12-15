const {getAllViajes, getOneViaje, getViajexConductor, getViajexUsuario, createViaje, UpdateViaje, deleteViaje} = require('../controllers/viaje.controller');
const validaJWT = require('../middlewares/valida-jwt');

module.exports = (app) => {
    app.get('/api/viajes',getAllViajes);
    app.get('/api/viajes/viaje/:id', validaJWT ,getOneViaje);
    app.get('/api/viajes/:id', validaJWT ,getViajexConductor);
    app.get('/api/viajes/empresa/:id', validaJWT ,getViajexUsuario);
    app.post('/api/viajes/new', validaJWT ,createViaje);
    app.put('/api/viajes/update/:id', validaJWT ,UpdateViaje);
    app.delete('/api/viajes/delete/:id', validaJWT ,deleteViaje);
}