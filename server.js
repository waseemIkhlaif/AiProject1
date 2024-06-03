const express = require('express');
const sequelize = require('./config/db');
const vrpRoutes = require('./controllers/vrp');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api/vrp', vrpRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
