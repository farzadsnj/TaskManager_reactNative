// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
      // Check if user already exists
      let user = await User.findOne({ where: { email } });

      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash password and create new user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
          username,
          email,
          password: hashedPassword,
      });

      const payload = {
          user: {
              id: user.id,
          },
      };

      // Sign token and return
      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
          (err, token) => {
              if (err) throw err;
              res.json({ token });
          }
      );
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        res.json({ token: generateToken(user.id) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
