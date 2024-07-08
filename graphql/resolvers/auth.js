const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async (args) => {
    const { email, password } = args.userInput;
    try {
      const encrypted = await bcrypt.hash(password, 12);
      
      const existing = await User.findOne({ email });
      if (existing) throw new Error('User already exists!');

      const user = new User({
        email, 
        password: encrypted
      });
      await user.save();
      return user;
    } catch(err) {
      console.error('Error in createUser:', err);
      throw err;
    }
  },
  login: async({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not exist!');

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) throw new Error('Invalid password!');

      const token = jwt.sign(
        { userId: user.id, email: user.email }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { userId: user.id, token, tokenExpiration: 1 }
    } catch(err) {
      console.error('Error in login:', err);
      throw err;
    }
  }
}