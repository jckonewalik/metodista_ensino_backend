const { User } = require('../models');
class UserController {
  async store(req, res) {
    if (!req.roles || req.roles.indexOf('ROLE_ADMIN') == -1) {
      return res.status(401).json({ message: 'User without permissions' });
    }
    const { name, email, password } = req.body;
    try {
      const user = await User.create({
        name,
        email,
        password,
      });
      return res.status(201).json({ user });
    } catch (error) {
      return res.status(400).json({ message: `${error.errors[0].message}` });
    }
  }
}

module.exports = new UserController();
