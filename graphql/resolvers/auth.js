const bcrypt = require('bcryptjs');

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
  }
}