const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Task extends Model {}

    Task.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pending',
        },
    }, {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks',
    });

    return Task;
};
