const User = require("../models/User");
const {generateToken} = require("../helpers/jwt");
 const changeUsername=async(req,res)=>{
    try {
        const username=req.username;
        const newUsername=req.body.newUsername;
        let user= await User.findOne({username:newUsername});
        console.log("antiguo user:"+username)
        if(user){
            return res.status(400).json({
                message:"El nombre de usuario ya existe."
            })
        }
        user=await User.findOneAndUpdate({username},{username:newUsername},{new:true});
        console.log("se cambió a "+user.username)
        const token=await generateToken(req.uid,newUsername);
        const cookieOptions = {
            maxAge: 24 * 60 * 60 * 1000, // Tiempo de expiración en milisegundos
            secure: process.env.NODE_ENV === 'production', // Asegura que la cookie solo se envíe a través de HTTPS (opcional)
            sameSite: 'strict', // Previene ataques CSRF (opcional)
            httpOnly: true, // Asegura que la cookie solo sea accesible por el servidor, no por JavaScript
        };
       return res.cookie("jwtToken", token, cookieOptions).status(200).json({ message:"El nombre de usuario se ha actualizado con exito"});


    }catch (e) {
        console.log(e.message)
        res.status(500).json({ message: "Error al actualizar el nombre de usuario" });
    }
}

const setUsername=async(req,res)=>{
     try {
         const username=req.body.username;
         let user= await User.findOne({username});
         if(user){
             return res.status(400).json({
                 message:"El nombre de usuario ya existe."
             })
         }
        user= await User.findByIdAndUpdate(req.uid,{username},{new:true})
         const token=await generateToken(req.uid,user.username);
         const cookieOptions = {
             maxAge: 24 * 60 * 60 * 1000, // Tiempo de expiración en milisegundos
             secure: process.env.NODE_ENV === 'production', // Asegura que la cookie solo se envíe a través de HTTPS (opcional)
             sameSite: 'strict', // Previene ataques CSRF (opcional)
             httpOnly: true, // Asegura que la cookie solo sea accesible por el servidor, no por JavaScript
         };
         return res.cookie("jwtToken", token, cookieOptions).status(200)
             .json({ message:"El nombre de usuario se ha actualizado con exito"});


     }catch (e) {
         res.status(500).json({ message: "Error al actualizar el nombre de usuario" });
     }
}

module.exports={
    setUsername,
     changeUsername,
}