const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Agendamento = sequelize.define(
    "Agendamento",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        clienteId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        data: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        horario: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        observacoes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(
                "PENDENTE",
                "CONFIRMADO",
                "CANCELADO",
                "CONCLUIDO"
            ),
            allowNull: false,
            defaultValue: "PENDENTE"
        }
    },
    {
        tableName: "agendamentos",
        timestamps: true
    }
);

module.exports = Agendamento;