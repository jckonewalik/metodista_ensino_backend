const { User } = require('../models');
class UserController {
  async store(req, res) {
    const { name, email, password } = req.body;
    try {
      const user = await User.create({
        name,
        email,
        password,
      });
      return res.json({ user });
    } catch (error) {
      return res.status(401).json({ message: `${error.errors[0].message}` });
    }
  }
}

module.exports = new UserController();
