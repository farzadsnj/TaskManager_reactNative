// controllers/taskController.js

const Task = require('../models/Task'); // Correct import path for Task model

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;

  try {
    const newTask = await Task.create({
      title,
      description,
      dueDate,
      userId: req.user.id,
    });

    res.json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const { title, description, dueDate } = req.body;

  try {
    let task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Ensure user owns task
    if (task.userId !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Ensure user owns task
    if (task.userId !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await task.destroy();

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
