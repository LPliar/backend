const database = require('../config/database')
const { DataTypes } = require("sequelize")
const Categoria = require('./categoria')

const Produto = database.define("Produto", {
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
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    min_estoque: {
        type: DataTypes.INTEGER
    },
    categoria_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categoria,
            key: "id"
        }
    },
}, {
    tableName: "produtos",
    timestamps: true
})

Produto.sync({alter: true})

Produto.belongsTo(Categoria, {
    foreignKey: 'categoria_id',
    as: 'categoria'
})

Categoria.hasMany(Produto, {
    foreignKey: 'categoria_id',
    as: 'produtos'
})

module.exports = Produto