const express = require("express");
const app = express();
const cors = require("cors"); // Importa el middleware cors

const api = require("./routes/api");

// Middleware para el manejo de solicitudes JSON
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", api);

module.exports = app;
