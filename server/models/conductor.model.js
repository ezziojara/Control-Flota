const mongoose = require("mongoose");
const { string } = require("yup");
// const uniqueValidator = require('mongoose-unique-validator');

const ConductorSchema = new mongoose.Schema(
	{
        rut: {
            type: String,
            required: [true, "Rut es requerido"],
        },
		first_name: {
			type: String,
			required: [true, "Nombre es requerido"],
			minlength: [2, "Nombre debe tener al menos 2 caracteres"]
		},
		last_name: {
			type: String,
			required: [true, "Apellido es requerido"],
			minlength: [2, "Apellido debe tener al menos 2 caracteres"]
		},
        fechaNacimiento: {
            type: Date,
            required: [true, 'debe ingresar fecha de nacimiento']
        },
        // fechaVencimientoLicencia: {
        //     type: Date,
        //     required: [true, 'debe ingresar fecha de vencimiento de licencia']
        // },
        estado: {
            type: String,
            required: [true, "Estado es requerido"]    
        },
        autor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: [true, "usuario is required"]
        }
	},
	{ timestamps: true }
);


// ConductorSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

const Conductor = mongoose.model("Conductor", ConductorSchema);

module.exports = Conductor;