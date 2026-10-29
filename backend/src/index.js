require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");
const routes = require("./config/routes");

// Models
const Categoria = require("./models/categoria");
const Produto = require("./models/produto");
const Cliente = require("./models/cliente");
const Agendamento = require("./models/agendamento");

// Relacionamento entre categoria e produto
Categoria.hasMany(Produto, {
    foreignKey: "categoriaId",
    as: "produtos",
    onDelete: "RESTRICT"
});

Produto.belongsTo(Categoria, {
    foreignKey: "categoriaId",
    as: "categoria"
});

// Relacionamento entre cliente e agendamento
Cliente.hasMany(Agendamento, {
    foreignKey: "clienteId",
    as: "agendamentos",
    onDelete: "RESTRICT"
});

Agendamento.belongsTo(Cliente, {
    foreignKey: "clienteId",
    as: "cliente"
});

// Aplicação Express
const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173"
    ]
}));

app.use(express.json({ limit: "1mb" }));

app.use(routes);

// Tratamento geral de erros
app.use((error, req, res, next) => {
    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    return res.status(500).json({
        mensagem: "Erro interno do servidor."
    });
});

// Inicialização
const PORT = process.env.PORT || 3001;

async function iniciarServidor() {
    try {
        await sequelize.authenticate();

        console.log("Banco de dados conectado.");

        await sequelize.sync({
            alter: true
        });

        console.log("Tabelas sincronizadas.");

        app.listen(PORT, () => {
            console.log(
                `Servidor rodando em http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error("Erro ao iniciar o servidor:", error.message);
        process.exitCode = 1;
    }
}

iniciarServidor();