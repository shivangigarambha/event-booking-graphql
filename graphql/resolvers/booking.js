const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { formatBooking, formatEvent } = require('./helper');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find({});
      return bookings.map(booking => formatBooking(booking))
    } catch(err) {
      console.error('Error in bookings:', err);
      throw err;
    }
  },
  bookEvent: async args => {
    const { eventId } = args;
    try {
      const event = await Event.findById(eventId);
      if(!event) throw new Error('Event not found!');

      const booking = new Booking({
        user: '6687cba600c20bb9e62a303b',
        event
      });
      await booking.save();
      return formatBooking(booking);
    } catch(err) {
      console.error('Error in bookEvent:', err);
      throw err;
    }
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      if (!booking) throw new Error('Booking not found!');

      await Booking.deleteOne({ _id: bookingId }); 
      return formatEvent(booking.event);
    } catch(err) {
      console.error('Error in cancelBooking:', err);
      throw err;
    }
  }
}