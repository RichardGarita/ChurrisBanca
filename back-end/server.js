const app = require('./app');
const port = process.env.PORT || 4223;
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
}); 