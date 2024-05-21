const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Sequelize connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3306, // Default MySQL port, adjust if your server runs on a different port
    logging: console.log, // Enable logging for development
});

// Import User model
const User = require('./models/User')(sequelize);

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
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
