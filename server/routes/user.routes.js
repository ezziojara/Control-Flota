const {AutenticaUsuario, createUsuario} = require('../controllers/user.controller');

module.exports = (app) => {
    app.post('/api/aut/login',AutenticaUsuario);
    app.post('/api/aut/registrar',createUsuario);
}