const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
    "Usuario",
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
        senha: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        hash: {
            type: DataTypes.STRING(64),
            allowNull: true
        },
        tokenExpiraEm: {
            type: DataTypes.DATE,
            allowNull: true
        },
        perfil: {
            type: DataTypes.ENUM("ADMIN", "ATENDENTE"),
            allowNull: false,
            defaultValue: "ATENDENTE"
        }
    },
    {
        tableName: "usuarios",
        timestamps: true
    }
);

module.exports = Usuario;