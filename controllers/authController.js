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

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      user = await User.create({
          username,
          email,
          password: hashedPassword
      });

      // Create token
      const payload = { user: { id: user.id } };
      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 3600 }, // 1 hour
          (err, token) => {
              if (err) throw err;
              res.json({ token });
          }
      );
  } catch (err) {
      console.error('Server Error:', err.message);
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
