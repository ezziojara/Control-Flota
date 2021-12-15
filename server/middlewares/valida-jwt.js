const jwt = require('jsonwebtoken');

 const validaJWT = (req, res, next) => {

     const token = req.header('token');

     if(!token){
         return res.status(401).json({
             ok: false,
             msg: 'no hay token en la petición'
         })
     }

     try{

        const { id, email, name  } = jwt.verify(token, process.env.SECRET_JWT)

        // console.log('id:',id)
        req.id = id,
        req.email = email,
        req.name = name

     }catch(err){

        // console.log('error:',err)
        return res.status(401).json({
            ok: false,
            msg: 'token no valido '
        })
     }
     next();
 }

 module.exports = validaJWT;