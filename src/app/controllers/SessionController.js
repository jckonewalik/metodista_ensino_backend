const { User } = require('../models');

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email: `${email.toLowerCase()}` },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    return res.json({ user, token: user.generateToken() });
  }
}

module.exports = new SessionController();
