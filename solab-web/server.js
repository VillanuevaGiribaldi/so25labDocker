const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const app = require('express')();

const moment = require('moment');

app.locals.Estado_DB ="off";

// Live Reload configuration
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Fontend route
const FrontRouter = require('./routes/front');

// Set ejs template engine
app.set('view engine', 'ejs');

app.use(connectLiveReload())

app.use(bodyParse.urlencoded({ extended: false }));
app.locals.moment = moment;

// Database connection
try {

const db = require('./config/keys').mongoProdURI;
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log(`Mongodb Connected`);
        app.locals.Estado_DB="on";
    }).catch(error => console.log(error));   
} catch (error) {
    console.log("No se encontro la base de datos");
}


app.use(FrontRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});