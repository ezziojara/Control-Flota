const mongoose = require("mongoose");
// const uniqueValidator = require('mongoose-unique-validator');

const ViajeSchema = new mongoose.Schema(
	{
        
		inicio: {
			type: String,
			required: [true, "Ruta de inicio es requerido"],
			minlength: [2, "Ruta de inicio debe tener al menos 2 caracteres"]
		},
		fin: {
			type: String,
			required: [true, "Ruta de fin es requerido"],
			minlength: [2, "Ruta de fin debe tener al menos 2 caracteres"]
		},
        tipoCarga: {
            type: Array,
            required: [true, 'Debe ingresar tipo de carga']
        },
		fechaSalida: {
            type: Date,
            required: [true, 'Debe ingresar fecha de Salida']
        },
		horaSalida: {
            type: String,
            required: [true, 'Debe ingresar hora de salida']
        },
		fechaEntrada: {
            type: Date
        },
		horaEntrada: {
            type: String
        },
        estado: {
            type: String,
			required: [true, 'Debe ingresar estado']
        },
        empresa_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: [true, "Empresa es requerido"]
        },
        conductor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conductor", 
            required: [true, "Conductor es requerido"]
        }
	},
	{ timestamps: true }
);


// ConductorSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

const Viaje = mongoose.model("Viaje", ViajeSchema);

module.exports = Viaje;