const db = require('./db')


const  pgto = db.sequelize.define('pagamentos', {
    nome: {
        type: db.Sequelize.STRING
    },
    valor:{
        type: db.Sequelize.DOUBLE
    },
    servico:{
        type: db.Sequelize.STRING
    },
    Fpgto:{
        type: db.Sequelize.STRING
    }
})
 
module.exports = pgto;