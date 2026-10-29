const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cliente = sequelize.define(
    "Cliente",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        telefone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        tipoDocumento: {
            type: DataTypes.ENUM("CAC", "RG"),
            allowNull: false
        },
        numeroDocumento: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    },
    {
        tableName: "clientes",
        timestamps: true
    }
);

module.exports = Cliente;