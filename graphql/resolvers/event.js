const Event = require('../../models/event');
const User = require('../../models/user');

const { formatEvent } = require('./helper');

module.exports = {
  events: async () => {
    try {
      // const events = await Event.find({}).populate({
      //   path: 'creator',
      //   populate: 'createdEvents'
      // });
      // return events;
      // Written below to implement multi level population
      const events = await Event.find({});
      return events.map(event => formatEvent(event));
    } catch(err) {
      console.error('Error in events:', err);
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized!')
    }
    const { title, description, price, date } = args.eventInput;
    try {
      const event = new Event({ 
        title, 
        description,
        price: +price,
        date: new Date(date),
        creator: req.userId
      });
      await event.save();

      const user = await User.findById(user.userId);
      if (!user) throw new Error('User Not found!');
      user.createdEvents.push(event);
      await user.save();

      return event;
    } catch(err) {
      console.error('Error in createEvent:', err);
      throw err;
    }
  }
}