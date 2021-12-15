const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;
require('dotenv').config();
require('./server/config/mongoose.config');

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const userRoutes = require('./server/routes/user.routes');
const viajeRoutes = require('./server/routes/viaje.routes');
const conductorRoutes = require('./server/routes/conductor.routes');
viajeRoutes(app);
userRoutes(app);
conductorRoutes(app);

app.listen(port, () => console.log('Im listening so cool!'))