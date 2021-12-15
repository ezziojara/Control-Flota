const Conductor = require('../models/conductor.model');

module.exports.getAllConductoresxUsuario = async (req, res) => {
    try{
        const { id } = req.params;
        const condutorList = await Conductor.find({ autor: id });
        
        return res.json({ condutorList });
    }catch(err){
        return res.status(500).json({error: err});
    }
};

module.exports.getOneConductor = async (req, res) => {
    try{
        const { id } = req.params;
        const conductor = await Conductor.findById(id);
        return res.json({ conductor });

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.getConductorxUsuario = async (req, res) => {
    try{
        const { id } = req.params;
        const conductorList = await Conductor.find({ autor: id, estado: 'Activo' });
        return res.json({ conductorList });

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.createConductor = async (req, res) => {
    try{
        
        const { body } = req;
        const newConductor = await Conductor.create(body)
        return res.json({ newConductor })

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.UpdateConductor = async (req, res) => {
    try{
        const { id } = req.params;
        const updateConductor =  await Conductor.findByIdAndUpdate({_id: id},req.body,{new: true});
        return res.json({msg: 'Se ha actualizado correctamente', updateConductor});

    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports.deleteConductor = async (req, res) => {
    try{
        const { id } = req.params;
        const deleteConductor =  await Conductor.deleteOne({_id: id});
        return res.json({msg: 'Se ha borrado pirata exitosamente', conductor: deleteConductor});
    }catch(err){
        return res.status(500).json({error: err});
    }
}