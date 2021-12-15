const {getAllConductoresxUsuario, getOneConductor, getConductorxUsuario, createConductor, UpdateConductor, deleteConductor} = require('../controllers/conductor.controller');
const validaJWT = require('../middlewares/valida-jwt');

module.exports = (app) => {
    app.get('/api/conductores/:id', validaJWT ,getAllConductoresxUsuario);
    app.get('/api/conductores/conductor/:id', validaJWT ,getOneConductor);
    app.get('/api/conductores/empresa/:id', validaJWT ,getConductorxUsuario);
    app.post('/api/conductores/new', validaJWT ,createConductor);
    app.put('/api/conductores/update/:id', validaJWT ,UpdateConductor);
    app.delete('/api/conductores/delete/:id', validaJWT ,deleteConductor);
}