const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const formatEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: getUser.bind(this, event._doc.creator)
  }
}

const formatBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: getUser.bind(this, booking._doc.user),
    event: getEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  }
}

const getEvents = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return formatEvent(event);
    })
  } catch(err) {
    console.error('Error in getEvents:', err);
    throw err;
  }
}

const getEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found!');
    return formatEvent(event);
  } catch(err) {
    console.error('Error in singleEvent:', err);
    throw err;
  }
}

const getUser = async userId => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found!');
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: getEvents.bind(this, user._doc.createdEvents)
    }
  } catch(err) {
    console.error('Error in getUser:', err);
    throw err;
  }
}

exports.formatEvent = formatEvent;
exports.formatBooking = formatBooking;