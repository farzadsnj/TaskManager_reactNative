const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { check, validationResult } = require('express-validator');

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = (User) => {
    return {
        register: [
            // Validation rules
            check('username').not().isEmpty().withMessage('Username is required'),
            check('email').isEmail().withMessage('Please include a valid email'),
            check('password')
                .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
                .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
                .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
                .matches(/[0-9]/).withMessage('Password must contain a number')
                .matches(/[^A-Za-z0-9]/).withMessage('Password must contain a special character'),

            // Request handler
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const { username, email, password } = req.body;

                try {
                    // Check if username already exists
                    let user = await User.findOne({ where: { username } });
                    if (user) {
                        return res.status(400).json({ msg: 'User already exists' });
                    }

                    // Check if email is already used
                    user = await User.findOne({ where: { email } });
                    if (user) {
                        return res.status(400).json({ msg: 'Email already in use' });
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
            }
        ],

        login: async (req, res) => {
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
        }
    }
};
