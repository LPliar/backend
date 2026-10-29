const crypto = require("crypto");
const Usuario = require("../models/user");

function gerarHash(valor) {
    return crypto
        .createHash("sha256")
        .update(valor)
        .digest("hex");
}

async function verificarToken(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                mensagem: "Token não informado."
            });
        }

        const partes = authorization.split(" ");

        if (
            partes.length !== 2 ||
            partes[0].toLowerCase() !== "bearer" ||
            !partes[1]
        ) {
            return res.status(401).json({
                mensagem: "Formato do token inválido."
            });
        }

        const token = partes[1];
        const hashToken = gerarHash(token);

        const usuario = await Usuario.findOne({
            where: {
                hash: hashToken
            }
        });

        if (!usuario || !usuario.tokenExpiraEm ||
            usuario.tokenExpiraEm <= new Date()) {
            return res.status(401).json({
                mensagem: "Token inválido ou expirado."
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao validar o token."
        });
    }
}

function exigirPerfil(...perfis) {
    return (req, res, next) => {
        if (
            !req.usuario ||
            !perfis.includes(req.usuario.perfil)
        ) {
            return res.status(403).json({
                mensagem: "Acesso não autorizado."
            });
        }

        next();
    };
}

module.exports = {
    verificarToken,
    exigirPerfil
};