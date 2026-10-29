const Cliente = require("../models/cliente");

async function listar(req, res) {
    try {
        const clientes = await Cliente.findAll({
            attributes: {
                exclude: ["updatedAt"]
            },
            order: [["nome", "ASC"]]
        });

        return res.json(clientes);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao listar clientes."
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const cliente = await Cliente.findByPk(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                mensagem: "Cliente não encontrado."
            });
        }

        return res.json(cliente);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao consultar cliente."
        });
    }
}

module.exports = {
    listar,
    buscarPorId
};