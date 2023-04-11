const db = require("./db")

const express = require("express")
const app = express()
const ejs = require("ejs")
const path = require("path")

const bodyParser = require("body-parser")

app.set("views", path.join(__dirname, "views"))

app.engine("html", require("ejs").renderFile)

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))

db.connect()

port = 3000

app.listen(port, (err) => {
  if (err) {
    console.log(err)
    console.log("Ocorreu um erro!")
  } else {
    console.log(
      `Servidor iniciado com sucesso! Rodando em: http://localhost:${port}/`
    )
  }
})

// MÉTODO GET DA PÁGINA PRINCIPAL (HOME)
app.get("/", (req, res) => {
  res.render("createUser")
})

// MÉTODO POST DA PÁGINA PRINCIPAL, ELE CADASTRA UM USUÁRIO USANDO OS CAMPOS DA PÁGINA
app.post("/", (req, res) => {
  const customer = {
    nome: req.body.nome,
    idade: req.body.idade,
    uf: req.body.uf,
  }

  db.insertCustomers(customer)
    .then(() => {
      res.redirect("/usuarios")
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("Erro ao inserir cliente no banco de dados")
    })
})

// MÉTODO GET PARA BUSCAR TODOS OS CLIENTES
app.get("/usuarios", (req, res) => {
  db.selectCustomers()
    .then((results) => {
      res.render("listUsers", { users: results })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("Erro ao buscar clientes no banco de dados")
    })
})

// RENDERIZA A PÁGINA EDITUSER E LEVA O PARAMS ID
app.get("/editar/:id", (req, res) => {
  const id = req.params.id
  res.render("editUser", { id: id })
})

// MÉTODO GET FEITO PARA DELETAR UM USUÁRIO AO CLICAR NO BOTÃO DE EXCLUIR NA ROTA /USUARIOS
app.get("/usuarios/:id", (req, res) => {
  const id = req.params.id
  db.deleteCustomer(id)
    .then(() => {
      res.redirect("/usuarios")
    })
    .catch((err) => console.log(err))
})

// ATUALIZA O USUÁRIO AO USAR OS CAMPOS E PARAMETROS DA PÁGINA EDITUSER
app.post("/editar/:id", (req, res) => {
  const id = req.params.id
  const customer = {
    nome: req.body.nome,
    idade: req.body.idade,
    uf: req.body.uf,
  }
  db.updateCustomer(id, customer)
    .then((results) => {
      res.redirect("/usuarios")
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("Erro ao atualizar cliente")
    })
})

// HTMLS PEDIDOS

app.get("/pedidos", (req, res) => {
  db.selectCustomers()
    .then((results) => {
      res.render("createOrder", { users: results })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("Erro ao buscar clientes no banco de dados")
    })
})

app.post("/pedidos", (req, res) => {
  const order = {
    id_usuario: req.body.id_usuario,
    valor_total: req.body.valor_total,
    data_pedido: req.body.data_pedido,
  }

  db.insertOrder(order)
    .then(() => {
      res.redirect("/pedidos")
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("Erro ao inserir pedido no banco de dados")
    })
})

app.get("/listarpedidos", (req, res) => {
  db.selectOrders()
    .then((results) => {
      res.render("listOrders", { orders: results })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("Erro ao buscar clientes no banco de dados")
    })
})

// pag de ediçao pedidos
app.get("/editarpedidos/:id", (req, res) => {
  const id = req.params.id

  db.selectCustomers()
    .then((results) => {
      res.render("editOrder", { id: id, users: results })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("Erro ao buscar clientes no banco de dados")
    })
})

app.post("/editarpedidos/:id", (req, res) => {
  const id = req.params.id
  const order = {
    id_usuario: req.body.id_usuario,
    valor_total: req.body.valor_total,
    data_pedido: req.body.data_pedido,
  }

  db.updateOrder(id, order)
    .then(() => {
      res.redirect("/listarpedidos")
    })
    .catch((err) => {
      console.log(order.id_usuario)
      console.log(err)
      res.status(500).send("Erro ao atualizar pedido")
    })
})

app.get("/pedidos/:id", (req, res) => {
  const id = req.params.id
  db.deleteOrder(id)
    .then(() => {
      res.redirect("/listarpedidos")
    })
    .catch((err) => console.log(err))
})
