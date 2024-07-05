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
  createEvent: async (args) => {
    const { title, description, price, date } = args.eventInput;
    try {
      const event = new Event({ 
        title, 
        description,
        price: +price,
        date: new Date(date),
        creator: '6687cba600c20bb9e62a303b'
      });
      await event.save();

      const user = await User.findById('6687cba600c20bb9e62a303b');
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