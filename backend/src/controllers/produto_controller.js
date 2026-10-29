const Produto = require("../models/produto");
const Categoria = require("../models/categoria");

async function listar(req, res) {
    try {
        const produtos = await Produto.findAll({
            where: { ativo: true },
            include: [{
                model: Categoria,
                as: "categoria",
                attributes: ["id", "nome"]
            }],
            order: [["nome", "ASC"]]
        });

        return res.json(produtos);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao listar o catálogo."
        });
    }
}

async function criar(req, res) {
    try {
        const { nome, descricao, categoriaId, imagemUrl } = req.body;

        if (!nome?.trim() || !descricao?.trim() || !categoriaId) {
            return res.status(400).json({
                mensagem: "Nome, descrição e categoria são obrigatórios."
            });
        }

        const categoria = await Categoria.findByPk(categoriaId);

        if (!categoria || !categoria.ativo) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada ou inativa."
            });
        }

        const produto = await Produto.create({
            nome: nome.trim(),
            descricao: descricao.trim(),
            categoriaId,
            imagemUrl: imagemUrl || null,
            ativo: true
        });

        return res.status(201).json({
            mensagem: "Item institucional cadastrado.",
            produto
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar item do catálogo."
        });
    }
}

async function atualizar(req, res) {
    try {
        const produto = await Produto.findByPk(req.params.id);

        if (!produto) {
            return res.status(404).json({
                mensagem: "Item não encontrado."
            });
        }

        const { nome, descricao, categoriaId, imagemUrl, ativo } = req.body;

        if (nome !== undefined && !nome.trim()) {
            return res.status(400).json({
                mensagem: "O nome não pode ficar vazio."
            });
        }

        if (descricao !== undefined && !descricao.trim()) {
            return res.status(400).json({
                mensagem: "A descrição não pode ficar vazia."
            });
        }

        if (categoriaId !== undefined) {
            const categoria = await Categoria.findByPk(categoriaId);

            if (!categoria || !categoria.ativo) {
                return res.status(404).json({
                    mensagem: "Categoria não encontrada ou inativa."
                });
            }
        }

        await produto.update({
            nome: nome === undefined ? produto.nome : nome.trim(),
            descricao: descricao === undefined
                ? produto.descricao
                : descricao.trim(),
            categoriaId: categoriaId ?? produto.categoriaId,
            imagemUrl: imagemUrl === undefined
                ? produto.imagemUrl
                : imagemUrl,
            ativo: ativo ?? produto.ativo
        });

        return res.json({
            mensagem: "Item atualizado.",
            produto
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar item."
        });
    }
}

async function excluir(req, res) {
    try {
        const produto = await Produto.findByPk(req.params.id);

        if (!produto) {
            return res.status(404).json({
                mensagem: "Item não encontrado."
            });
        }

        await produto.update({ ativo: false });

        return res.json({
            mensagem: "Item desativado no catálogo."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao desativar item."
        });
    }
}

module.exports = {
    listar,
    criar,
    atualizar,
    excluir
};