import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true },
    edad: { type: Number, required: true },
    dni: { type: Number, required: true },
    direccion: { type: String, required: true }
});

const clienteModel = mongoose.model("Cliente", clienteSchema);
export default clienteModel;