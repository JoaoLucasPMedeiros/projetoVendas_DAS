const express = require('express');
const app = express();
const PORT = 8080;
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const pgto = require('./models/pgto');
const moment = require('moment');
const Sequelize = require('sequelize');
const OP = Sequelize.Op;
const path = require('path');

//BODYPARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//HANDLEBARS
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' ,
    helpers:{FormatDate: (date)=>{
    return moment(date).format("DD/MM/YYYY")
}}}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//SERVIDOR
app.listen(PORT, ()=>{
    console.log(`Express rodando na porta ${PORT}`);
});

//ROTA
app.get('/pagamento', (res,req) =>{

  
    
    pgto.findAll({order: [['id', 'DESC']]})
    .then((PGTO)=>{
        req.render('pagamento',{PGTO:PGTO})
    })
   
  

})

app.get('/cad-pagamento', (res,req) =>{
    req.render('cad-pagamento')
})

//ADD VALOR AO BANCO
app.post('/add-pagamento', (req,res)=>{
    pgto.create({
        nome:     req.body.nome,
        valor:    req.body.valor,
        servico:  req.body.servico,
        Fpgto:     req.body.pgto
    })
    .then(()=>{
        res.redirect('/pagamento')
    })
    .catch((err)=>{
        res.send(" ERRO: Pagamento não foi cadastrado com sucesso:Voltar ao relatorio de  <a href='/pagamento'>Vendas</a>")
    })
});


app.get('/del-pagamento/:id',(req,res)=>{
    pgto.destroy({
        where: {'id' :req.params.id }
    }).then(()=>{
        res.redirect('/pagamento');
    }).catch((err)=>{
        res.send("Pagamento não apagado com sucesso!");
    })
});

app.get('/users', async (req, res) => {
    const nome = req.query.nome; // Obtém o valor do parâmetro 'nome' enviado no formulário



    // Consulta no banco de dados com base no nome informado

    const users = await pgto.findAll({
      where: {
        nome: nome,
      },
    });



  
  
    if (users.length > 0) {
      // Renderiza o modelo Handlebars com os resultados da consulta
      res.render('users', { users });

    } else {
      // Renderiza o modelo Handlebars com mensagem de erro
      res.send('NÃO FOI ENCONTADO RESULTADOS, <a href="/pagamento">VOLTAR</a>');
    }
  });

  app.get('/sum', async (req, res) => {




    try {
      const result = await pgto.sum('valor');
      const count = await pgto.count('nome');
      let sum = 0;
      if (result !== null) {
        sum = result;

      }
  
      res.render('sum', { sum, count });
    } catch (error) {
      console.error('Erro ao realizar a soma:', error);
      res.status(500).send('Erro ao realizar a soma');
    }



  });


