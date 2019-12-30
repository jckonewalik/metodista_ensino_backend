const { User } = require('../models');
const Sequelize = require('sequelize');
const auth = require('../../firebase/firebase.utils');

class UserController {
  async update(req, res) {
    const { email } = req.body;
    try {
      await auth.sendPasswordResetEmail(email);
      return res.status(200).json({ message: `Um email foi enviado para o endereço ${email}` });

    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(400).json({ message: `Nenhum usuário cadastrado com o email ${email}` });
      }
      return res.status(400).json({ message: error.message });
    }
  }
  async store(req, res) {
    if (!req.roles || req.roles.indexOf('ROLE_ADMIN') == -1) {
      return res.status(401).json({ message: 'Usuário sem permissão' });
    }
    const { name, email, password } = req.body;
    const foundUser = await User.findOne({
      where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), Sequelize.fn('lower', email))
    });
    if (foundUser) {
      return res.status(400).json({ message: 'O usuário já esta cadastrado' });
    }
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      const user = await User.create({
        name,
        email
      });
      return res.status(201).json({ user });
    } catch (error) {
      return res.status(400).json({ message: `${error.message}` });
    }
  }
}

module.exports = new UserController();
