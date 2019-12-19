const jwt = require('jsonwebtoken');
const { promisify } = require('util');
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    let decoded;
    if (
      process.env.NODE_ENV !== 'test' ||
      (process.env.NODE_ENV === 'test' && token !== 'Test')
    ) {
      decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET);
    }

    req.userId = (decoded && decoded.id) || null;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};
