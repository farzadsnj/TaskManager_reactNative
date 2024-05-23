const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: console.log,
});

// Import models
const User = require('./models/User')(sequelize, Sequelize.DataTypes);
const Task = require('./models/Task')(sequelize, Sequelize.DataTypes);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Define routes
app.get('/', (req, res) => res.send('Welcome to the Task Manager API'));
const authRoutes = require('./routes/auth')(User);
app.use('/api/auth', authRoutes);

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', require('./middleware/auth'), taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
