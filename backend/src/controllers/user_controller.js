const crypto = require("crypto");
const Usuario = require("../models/user");

function gerarHash(valor) {
    return crypto
        .createHash("sha256")
        .update(valor)
        .digest("hex");
}

function gerarToken() {
    return crypto.randomBytes(32).toString("hex");
}

async function register(req, res) {
    try {
        const { nome, email, senha, repeteSenha } = req.body;

        if (
            !nome?.trim() ||
            !email?.trim() ||
            !senha ||
            !repeteSenha
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                mensagem: "A senha deve ter pelo menos 6 caracteres."
            });
        }

        if (senha !== repeteSenha) {
            return res.status(400).json({
                mensagem: "As senhas não coincidem."
            });
        }

        const emailFormatado = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFormatado)) {
            return res.status(400).json({
                mensagem: "E-mail inválido."
            });
        }

        const quantidade = await Usuario.count();

        if (quantidade > 0) {
            return res.status(409).json({
                mensagem: "O administrador inicial já foi cadastrado."
            });
        }

        const usuario = await Usuario.create({
            nome: nome.trim(),
            email: emailFormatado,
            senha: gerarHash(senha),
            hash: null,
            tokenExpiraEm: null,
            perfil: "ADMIN"
        });

        return res.status(201).json({
            mensagem: "Administrador cadastrado com sucesso.",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });
    } catch (error) {
        console.error(error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao cadastrar administrador."
        });
    }
}

async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email?.trim() || !senha) {
            return res.status(400).json({
                mensagem: "E-mail e senha são obrigatórios."
            });
        }

        const usuario = await Usuario.findOne({
            where: {
                email: email.trim().toLowerCase()
            }
        });

        if (!usuario || gerarHash(senha) !== usuario.senha) {
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            });
        }

        const token = gerarToken();

        usuario.hash = gerarHash(token);
        usuario.tokenExpiraEm = new Date(
            Date.now() + 8 * 60 * 60 * 1000
        );

        await usuario.save();

        return res.json({
            mensagem: "Login realizado com sucesso.",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao realizar login."
        });
    }
}

async function perfil(req, res) {
    return res.json({
        id: req.usuario.id,
        nome: req.usuario.nome,
        email: req.usuario.email,
        perfil: req.usuario.perfil
    });
}

async function logout(req, res) {
    try {
        req.usuario.hash = null;
        req.usuario.tokenExpiraEm = null;

        await req.usuario.save();

        return res.json({
            mensagem: "Logout realizado com sucesso."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao realizar logout."
        });
    }
}

async function criarAtendente(req, res) {
    try {
        const { nome, email, senha, repeteSenha } = req.body;

        if (
            !nome?.trim() ||
            !email?.trim() ||
            !senha ||
            !repeteSenha
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            });
        }

        if (senha !== repeteSenha || senha.length < 6) {
            return res.status(400).json({
                mensagem: "Verifique as senhas. Use pelo menos 6 caracteres."
            });
        }

        const emailFormatado = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFormatado)) {
            return res.status(400).json({
                mensagem: "E-mail inválido."
            });
        }

        const existente = await Usuario.findOne({
            where: { email: emailFormatado }
        });

        if (existente) {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        const usuario = await Usuario.create({
            nome: nome.trim(),
            email: emailFormatado,
            senha: gerarHash(senha),
            hash: null,
            tokenExpiraEm: null,
            perfil: "ATENDENTE"
        });

        return res.status(201).json({
            mensagem: "Atendente cadastrado com sucesso.",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar atendente."
        });
    }
}

async function listar(req, res) {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ["id", "nome", "email", "perfil", "createdAt"],
            order: [["nome", "ASC"]]
        });

        return res.json(usuarios);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao listar usuários."
        });
    }
}

module.exports = {
    register,
    login,
    perfil,
    logout,
    criarAtendente,
    listar
};