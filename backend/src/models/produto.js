const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Produto = sequelize.define(
    "Produto",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        categoriaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imagemUrl: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "produtos",
        timestamps: true
    }
);

module.exports = Produto;