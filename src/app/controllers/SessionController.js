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

    const { id, name } = user;
    const token = await user.generateToken();

    return res.json({ user: { id, name, token } });
  }
}

module.exports = new SessionController();
