const { User, Role } = require('../models');
const Sequelize = require('sequelize');
const auth = require('../../firebase/firebase.utils');

class SessionController {
  async show(req, res) {
    return res.status(200).json({ message: 'Token válido' });
  }
  async store(req, res) {
    const { email, password } = req.body;
    const loginError = 'Invalid email or password';

    auth
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        try {
          const user = await User.findOne({
            where: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('email')),
              Sequelize.fn('lower', email)
            ),
            include: [
              {
                model: Role,
                as: 'roles',
                attributes: ['id'],
                through: { attributes: [] },
              },
            ],
          });
          if (!user) {
            return res.status(400).json({ message: loginError });
          }

          const { id, name, roles } = user;
          const token = await user.generateToken();

          return res
            .status(200)
            .json({ user: { id, name, token, roles: roles.map(r => r.id) } });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          return res.status(400).json({ message: loginError });
        }
        if (error.code === 'auth/user-not-found') {
          return res.status(400).json({ message: loginError });
        }
        if (error.code === 'auth/wrong-password') {
          return res.status(400).json({ message: loginError });
        }
        return res.status(400).json({ message: error.message });
      });
  }
}

module.exports = new SessionController();
