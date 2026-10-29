const Curso = require("../models/curso");

async function listar(req, res) {
    try {
        const cursos = await Curso.findAll({
            where: { ativo: true },
            order: [["nome", "ASC"]]
        });

        return res.json(cursos);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao listar cursos."
        });
    }
}

async function criar(req, res) {
    try {
        const { nome, descricao, cargaHoraria } = req.body;

        if (!nome?.trim() || !descricao?.trim() ||
            !Number.isInteger(Number(cargaHoraria)) ||
            Number(cargaHoraria) < 1) {
            return res.status(400).json({
                mensagem: "Informe nome, descrição e carga horária válida."
            });
        }

        const curso = await Curso.create({
            nome: nome.trim(),
            descricao: descricao.trim(),
            cargaHoraria: Number(cargaHoraria),
            ativo: true
        });

        return res.status(201).json({
            mensagem: "Curso cadastrado com sucesso.",
            curso
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar curso."
        });
    }
}

async function atualizar(req, res) {
    try {
        const curso = await Curso.findByPk(req.params.id);

        if (!curso) {
            return res.status(404).json({
                mensagem: "Curso não encontrado."
            });
        }

        const { nome, descricao, cargaHoraria, ativo } = req.body;

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

        if (
            cargaHoraria !== undefined &&
            (!Number.isInteger(Number(cargaHoraria)) ||
                Number(cargaHoraria) < 1)
        ) {
            return res.status(400).json({
                mensagem: "Carga horária inválida."
            });
        }

        await curso.update({
            nome: nome === undefined ? curso.nome : nome.trim(),
            descricao: descricao === undefined
                ? curso.descricao
                : descricao.trim(),
            cargaHoraria: cargaHoraria === undefined
                ? curso.cargaHoraria
                : Number(cargaHoraria),
            ativo: ativo ?? curso.ativo
        });

        return res.json({
            mensagem: "Curso atualizado com sucesso.",
            curso
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar curso."
        });
    }
}

async function excluir(req, res) {
    try {
        const curso = await Curso.findByPk(req.params.id);

        if (!curso) {
            return res.status(404).json({
                mensagem: "Curso não encontrado."
            });
        }

        await curso.update({ ativo: false });

        return res.json({
            mensagem: "Curso desativado com sucesso."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao desativar curso."
        });
    }
}

module.exports = {
    listar,
    criar,
    atualizar,
    excluir
};