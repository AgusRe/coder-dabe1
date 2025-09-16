import { Router } from "express";
import clienteModel from "../models/Client.model.js";

const router = Router()

router.get("/", async (req, res) => {
    try {
        const clientes = await clienteModel.find().lean();
        res.send(clientes);
    } catch (err) {
        res.status(500).send("Error al cargar clientes");
    }
});

router.post("/", async (req, res) => {
    const nuevoCliente = req.body;
    try {
        const clienteCreado = await clienteModel.create(nuevoCliente);
        await clienteCreado.save();
        res.status(201).send(clienteCreado);
    } catch (err) {
        res.status(500).send("Error al crear cliente");
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const cliente = await clienteModel.findByIdAndUpdate(req.params.cid, req.body);
        if (!cliente) {
            return res.status(404).send("Cliente no encontrado");
        }
        res.send("cliente actualizado");
    } catch (err) {
        res.status(500).send("Error al actualizar cliente");
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const cliente = await clienteModel.findByIdAndDelete(req.params.cid);
        if (!cliente) {
            return res.status(404).send("Cliente no encontrado");
        }
        res.send("Cliente eliminado");
    } catch (err) {
        res.status(500).send("Error al eliminar cliente");
    }
});

export default router;