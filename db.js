// database
const mysql = require("mysql2/promise")

async function connect() {
  if (global.connection && global.connection.state !== "disconnected")
    return global.connection

  const connection = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "fatec",
    database: "crud",
  })

  console.log("Conectado com sucesso no MySQL!")
  global.connection = connection
  return global.connection
}

// FUNÇÕES DE USUARIOS

async function selectCustomers() {
  const conn = await connect()
  const [rows] = await conn.query("SELECT * FROM clientes;")
  return rows
}

async function insertCustomers(customer) {
  const conn = await connect()
  const sql = "INSERT INTO clientes(nome,idade,uf) VALUES (?,?,?);"
  const values = [customer.nome, customer.idade, customer.uf]
  return await conn.query(sql, values)
}

async function updateCustomer(id, customer) {
  const conn = await connect()
  const sql = `UPDATE clientes SET nome=?, idade=?, uf=? WHERE id=${id}`
  const values = [customer.nome, customer.idade, customer.uf]
  return await conn.query(sql, values)
}

async function deleteCustomer(id) {
  const conn = await connect()
  const sql = "DELETE FROM clientes where id=?;"
  return await conn.query(sql, [id])
}

// FUNÇÕES DE PEDIDOS

async function selectOrders() {
  const conn = await connect()
  const [rows] = await conn.query("SELECT * FROM pedidos;")
  return rows
}

async function insertOrder(order) {
  const conn = await connect()
  const sql =
    "INSERT INTO pedidos(id_usuario,valor_total,data_pedido) VALUES (?,?,?);"
  const values = [order.id_usuario, order.valor_total, order.data_pedido]
  return await conn.query(sql, values)
}

async function updateOrder(id, order) {
  const conn = await connect()
  const sql = `UPDATE pedidos SET id_usuario=?, valor_total=?, data_pedido=? WHERE id_pedido=${id}`
  const values = [order.id_usuario, order.valor_total, order.data_pedido]
  return await conn.query(sql, values)
}

async function deleteOrder(id) {
  const conn = await connect()
  const sql = "DELETE FROM pedidos where id_pedido=?;"
  return await conn.query(sql, [id])
}

module.exports = {
  connect,
  selectCustomers,
  insertCustomers,
  updateCustomer,
  deleteCustomer,
  selectOrders,
  insertOrder,
  updateOrder,
  deleteOrder,
}
