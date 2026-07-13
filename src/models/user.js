const database = require('../config/database')
const { DataTypes } = require("sequelize")

const User = database.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hash: {
        type: DataTypes.STRING
    }
},
{
    tableName: "users",
    timestamps: true
}
)
User.sync({alter: true})

module.exports = User