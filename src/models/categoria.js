const database = require('../config/database')
const { DataTypes } = require("sequelize")

const Categoria = database.define("Categoria", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT
    }
},
{
    tableName: "categorias",
    timestamps: true
}
)
Categoria.sync({alter: true})

module.exports = Categoria