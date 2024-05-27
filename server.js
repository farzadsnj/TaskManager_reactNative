const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { sequelize, User, Task } = require('./models'); // Ensure correct import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
