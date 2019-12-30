const { User } = require('../models');
const Sequelize = require('sequelize');
const auth = require('../../firebase/firebase.utils');

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const loginError = 'Invalid email or password'

    try {
      await auth.signInWithEmailAndPassword(email, password);
      const user = await User.findOne({
        where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), Sequelize.fn('lower', email))
      });
      if (!user) {
        return res.status(400).json({ message: loginError });
      }

      const { id, name } = user;
      const token = await user.generateToken();

      return res.status(200).json({ user: { id, name, token } });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(400).json({ message: loginError });
      }
      if (error.code === 'auth/wrong-password') {
        return res.status(400).json({ message: loginError });
      }
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new SessionController();
