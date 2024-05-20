const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const helmet = require('helmet');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set up Sequelize connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false // Toggle based on your environment preference
});

// Import models
const UserModel = require('./models/User');
const User = UserModel(sequelize);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        // Sync all models
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

// Include more routes as needed
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
