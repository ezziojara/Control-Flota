const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generaJWT } = require('../helpers/jwt');


module.exports.AutenticaUsuario = async (req, res) => {
    try{
        const { body } = req;

        const usuarioFind = await User.findOne({email: body.email});

        const validarPassword = bcrypt.compareSync(body.password, usuarioFind.password);
        
        // const usuario = {...usuario, token: 'bla'}

        if(validarPassword){

            const token = await generaJWT(usuarioFind._id,usuarioFind.email,usuarioFind.name)

            const usuario = {
                _id: usuarioFind._id,
                name: usuarioFind.name,
                email: usuarioFind.email,
                password: usuarioFind.password,
                token:token
            }

            return res.json({ usuario });
        }
        else{
            return res.status(401).json({error: 'Contraseña incorrecta'});
        }

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.createUsuario = async (req, res) => {
    try{
        
        const { body } = req;

        if(body.password === body.confirmPassword){
            
            const cuerpo = {
                name: body.name,
                email: body.email,
                password: body.password
            }
            const salt = bcrypt.genSaltSync();
            cuerpo.password =  bcrypt.hashSync(cuerpo.password, salt);

            const newUsuario = await User.create(cuerpo)
        
            return res.json({ newUsuario })
        }
        else{
            return res.status(401).json({error: 'las contraseñas deben ser identicas'});
        }

    }catch(err){

        return res.status(500).json({error: err});
    }
}