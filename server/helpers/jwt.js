const jwt = require('jsonwebtoken');

const generaJWT = (id, email, name) => {

    return new Promise((resolved, reject) => {
        const payload = { id, email, name };

        // console.log('SECRET_JWT',process.env.SECRET_JWT)

        jwt.sign(payload, process.env.SECRET_JWT, {
            expiresIn:'2h'
        }, (error, token) => {

            if (error) {
                // console.log(error)
                reject('No se puede generar el token');
                
            }

            resolved(token)
        });
    });

}

module.exports = {
    generaJWT
}