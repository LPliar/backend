const database = require('../config/database')
const { DataTypes } = require("sequelize")
const Produto = require('./produto')
const User = require('../models/user')

const Movimento = database.define("Movimento", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produto,
            key: "id"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    }
}, {
    tableName: "movimentacao",
    timestamps: true
})

Movimento.sync({alter: true})

Movimento.belongsTo(Produto, {
    foreignKey: 'produto_id',
    as: 'produtos'
})
Produto.hasMany(Movimento, {
    foreignKey: 'produto_id',
    as: 'movimentacao'
})


Movimento.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'users'
})
User.hasMany(Movimento, {
    foreignKey: 'user_id',
    as: 'movimentacao'
})

module.exports = Movimento