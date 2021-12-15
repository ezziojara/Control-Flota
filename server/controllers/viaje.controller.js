const Viaje = require('../models/viaje.model');

module.exports.getAllViajes = async (req, res) => {
    try{
        
        const viajeList = await Viaje.find();
        return res.json({ viajeList });
    }catch(err){
        return res.status(500).json({error: err});
    }
};

module.exports.getOneViaje = async (req, res) => {
    try{
        const { id } = req.params;
        const viaje = await Viaje.findById(id);
        return res.json({ viaje });

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.getViajexConductor = async (req, res) => {
    try{
        const { id } = req.params;
        const viajeList = await Viaje.find({ conductor_id: id });
        return res.json({ viajeList });

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.getViajexUsuario = async (req, res) => {
    try{
        const { id } = req.params;
        const viajeList = await Viaje.find({ empresa_id: id }).populate('conductor_id','first_name last_name');
       
        return res.json({ viajeList });

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.createViaje = async (req, res) => {
    try{
        
        const { body } = req;
        const carga = body.tipoCarga;
        const arr = carga.split(','); 
        body.tipoCarga = arr;
        const newViaje = await Viaje.create(body);
        return res.json({ newViaje });

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.UpdateViaje = async (req, res) => {
    try{
        const { id } = req.params;

        const carga = req.body.tipoCarga;
        const arr = carga.split(','); 
        req.body.tipoCarga = arr;

        const updateViaje =  await Viaje.findByIdAndUpdate({_id: id},req.body,{new: true});
        return res.json({msg: 'Se ha actualizado correctamente', updateViaje});

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.deleteViaje = async (req, res) => {
    try{
        const { id } = req.params;
        const deleteViaje =  await Viaje.deleteOne({_id: id});
        return res.json({msg: 'Se ha borrado pirata exitosamente', viaje: deleteViaje});
    }catch(err){
        return res.status(500).json({error: err});
    }
}