const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = (User) => {
    return {
        register: async (req, res) => {
            const { username, email, password } = req.body;

            try {
                let user = await User.findOne({ where: { email } });
                if (user) {
                    return res.status(400).json({ msg: 'User already exists' });
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                user = await User.create({
                    username,
                    email,
                    password: hashedPassword
                });

                const token = generateToken(user.id);
                res.json({ token });
            } catch (err) {
                console.error('Server Error:', err);
                res.status(500).json({ msg: 'Server error', error: err.message });
            }
        },

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

                const token = generateToken(user.id);
                res.json({ token });
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        }
    };
};
