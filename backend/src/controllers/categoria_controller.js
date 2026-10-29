const Categoria = require("../models/categoria");

async function listar(req, res) {
    try {
        const categorias = await Categoria.findAll({
            where: { ativo: true },
            order: [["nome", "ASC"]]
        });

        return res.json(categorias);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao listar categorias."
        });
    }
}

async function criar(req, res) {
    try {
        const { nome, descricao } = req.body;

        if (!nome?.trim()) {
            return res.status(400).json({
                mensagem: "O nome da categoria é obrigatório."
            });
        }

        const categoria = await Categoria.create({
            nome: nome.trim(),
            descricao: descricao || null,
            ativo: true
        });

        return res.status(201).json({
            mensagem: "Categoria criada com sucesso.",
            categoria
        });
    } catch (error) {
        console.error(error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                mensagem: "Já existe uma categoria com esse nome."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao criar categoria."
        });
    }
}

async function atualizar(req, res) {
    try {
        const categoria = await Categoria.findByPk(req.params.id);

        if (!categoria) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada."
            });
        }

        const { nome, descricao, ativo } = req.body;

        if (nome !== undefined && !nome.trim()) {
            return res.status(400).json({
                mensagem: "O nome não pode ficar vazio."
            });
        }

        await categoria.update({
            nome: nome === undefined ? categoria.nome : nome.trim(),
            descricao: descricao ?? categoria.descricao,
            ativo: ativo ?? categoria.ativo
        });

        return res.json({
            mensagem: "Categoria atualizada.",
            categoria
        });
    } catch (error) {
        console.error(error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                mensagem: "Já existe uma categoria com esse nome."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao atualizar categoria."
        });
    }
}

async function excluir(req, res) {
    try {
        const categoria = await Categoria.findByPk(req.params.id);

        if (!categoria) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada."
            });
        }

        // Desativa em vez de apagar os registros definitivamente.
        await categoria.update({ ativo: false });

        return res.json({
            mensagem: "Categoria desativada com sucesso."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao desativar categoria."
        });
    }
}

module.exports = {
    listar,
    criar,
    atualizar,
    excluir
};