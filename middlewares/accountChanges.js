const validateUsername=(schema)=>async(req,res,next)=>{
    try {

        await schema.parseAsync(req.body.newUsername || req.body.username);
        return next();
    }catch (error) {
        console.log(error.message)
        return res.status(400).json({
            error: error.errors[0],
        });
    }
}

module.exports = {
    validateUsername,
};