const { Op } = require("sequelize");
const sequelize = require("../config/database");

const Cliente = require("../models/cliente");
const Agendamento = require("../models/agendamento");

const statusPermitidos = [
    "PENDENTE",
    "CONFIRMADO",
    "CANCELADO",
    "CONCLUIDO"
];

function dataValida(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) {
        return false;
    }

    const [ano, mes, dia] = data.split("-").map(Number);
    const dataTeste = new Date(Date.UTC(ano, mes - 1, dia));

    return (
        dataTeste.getUTCFullYear() === ano &&
        dataTeste.getUTCMonth() === mes - 1 &&
        dataTeste.getUTCDate() === dia
    );
}

async function criar(req, res) {
    let transacao;

    try {
        const {
            nome,
            email,
            telefone,
            tipoDocumento,
            numeroDocumento,
            data,
            horario,
            observacoes
        } = req.body;

        if (
            !nome?.trim() ||
            !email?.trim() ||
            !telefone?.trim() ||
            !tipoDocumento ||
            !numeroDocumento?.trim() ||
            !data ||
            !horario
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        if (!["CAC", "RG"].includes(tipoDocumento)) {
            return res.status(400).json({
                mensagem: "O documento deve ser CAC ou RG."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                mensagem: "E-mail inválido."
            });
        }

        if (!dataValida(data)) {
            return res.status(400).json({
                mensagem: "Data inválida. Utilize AAAA-MM-DD."
            });
        }

        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
            return res.status(400).json({
                mensagem: "Horário inválido. Utilize HH:mm."
            });
        }

        transacao = await sequelize.transaction();

        const conflito = await Agendamento.findOne({
            where: {
                data,
                horario,
                status: {
                    [Op.ne]: "CANCELADO"
                }
            },
            transaction: transacao
        });

        if (conflito) {
            await transacao.rollback();

            return res.status(409).json({
                mensagem: "Este horário já possui uma solicitação ativa."
            });
        }

        const emailFormatado = email.trim().toLowerCase();

        const [cliente, clienteCriado] = await Cliente.findOrCreate({
            where: {
                email: emailFormatado
            },
            defaults: {
                nome: nome.trim(),
                email: emailFormatado,
                telefone: telefone.trim(),
                tipoDocumento,
                numeroDocumento: numeroDocumento.trim()
            },
            transaction: transacao
        });

        if (
            !clienteCriado &&
            (
                cliente.tipoDocumento !== tipoDocumento ||
                cliente.numeroDocumento !== numeroDocumento.trim()
            )
        ) {
            await transacao.rollback();

            return res.status(409).json({
                mensagem: "Os dados do documento não correspondem ao cadastro."
            });
        }

        const agendamento = await Agendamento.create(
            {
                clienteId: cliente.id,
                data,
                horario,
                observacoes: observacoes?.trim() || null,
                status: "PENDENTE"
            },
            {
                transaction: transacao
            }
        );

        await transacao.commit();

        return res.status(201).json({
            mensagem: "Solicitação registrada com sucesso.",
            agendamento: {
                id: agendamento.id,
                data: agendamento.data,
                horario: agendamento.horario,
                status: agendamento.status
            }
        });
    } catch (error) {
        if (transacao && !transacao.finished) {
            await transacao.rollback();
        }

        console.error(error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                mensagem: "Já existe um cadastro com esses dados."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao registrar agendamento."
        });
    }
}

async function listar(req, res) {
    try {
        const agendamentos = await Agendamento.findAll({
            include: [{
                model: Cliente,
                as: "cliente",
                attributes: [
                    "id",
                    "nome",
                    "email",
                    "telefone",
                    "tipoDocumento",
                    "numeroDocumento"
                ]
            }],
            order: [
                ["data", "ASC"],
                ["horario", "ASC"]
            ]
        });

        return res.json(agendamentos);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao listar agendamentos."
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const agendamento = await Agendamento.findByPk(
            req.params.id,
            {
                include: [{
                    model: Cliente,
                    as: "cliente",
                    attributes: [
                        "id",
                        "nome",
                        "email",
                        "telefone",
                        "tipoDocumento",
                        "numeroDocumento"
                    ]
                }]
            }
        );

        if (!agendamento) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        return res.json(agendamento);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao consultar agendamento."
        });
    }
}

async function atualizar(req, res) {
    try {
        const agendamento = await Agendamento.findByPk(req.params.id);

        if (!agendamento) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        const {
            data,
            horario,
            observacoes,
            status
        } = req.body;

        if (status !== undefined &&
            !statusPermitidos.includes(status)) {
            return res.status(400).json({
                mensagem: "Status inválido."
            });
        }

        if (data !== undefined && !dataValida(data)) {
            return res.status(400).json({
                mensagem: "Data inválida."
            });
        }

        if (
            horario !== undefined &&
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)
        ) {
            return res.status(400).json({
                mensagem: "Horário inválido."
            });
        }

        const novaData = data ?? agendamento.data;
        const novoHorario = horario ?? agendamento.horario;
        const novoStatus = status ?? agendamento.status;

        if (novoStatus !== "CANCELADO") {
            const conflito = await Agendamento.findOne({
                where: {
                    id: {
                        [Op.ne]: agendamento.id
                    },
                    data: novaData,
                    horario: novoHorario,
                    status: {
                        [Op.ne]: "CANCELADO"
                    }
                }
            });

            if (conflito) {
                return res.status(409).json({
                    mensagem: "Este horário já possui uma solicitação ativa."
                });
            }
        }

        await agendamento.update({
            data: novaData,
            horario: novoHorario,
            status: novoStatus,
            observacoes: observacoes ?? agendamento.observacoes
        });

        return res.json({
            mensagem: "Agendamento atualizado com sucesso.",
            agendamento
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar agendamento."
        });
    }
}

async function excluir(req, res) {
    try {
        const agendamento = await Agendamento.findByPk(req.params.id);

        if (!agendamento) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        await agendamento.update({
            status: "CANCELADO"
        });

        return res.json({
            mensagem: "Agendamento cancelado com sucesso."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao cancelar agendamento."
        });
    }
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    excluir
};