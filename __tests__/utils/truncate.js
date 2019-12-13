const { sequelize } = require('../../src/app/models');

module.exports = models => {
  return Promise.all(
    models.map(model => {
      return model.destroy({ truncate: true, force: true });
    })
  );
};
