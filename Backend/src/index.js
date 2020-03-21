const app = require('./app/app');
const config = require('./config').config;

app.set('port', config.port);

app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado en el puerto ${app.get('port')}`);
});