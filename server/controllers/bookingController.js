import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

export const createBooking = async (req, res) => {
  try {
    const { eventId, ticketCount } = req.body;
    const userId = req.userId;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const existingBooking = await Booking.findOne({ user: userId, event: eventId });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this event' });
    }
    
    const booking = new Booking({
      event: eventId,
      user: userId,
      ticketCount: ticketCount || 1
    });
    
    await booking.save();
    
    event.bookings.push(booking._id);
    await event.save();
    
    const user = await User.findById(userId);
    user.bookings.push(booking._id);
    await user.save();
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;
    
    const bookings = await Booking.find({ user: userId })
      .populate('event')
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.userId;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.user.toString() !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Event.findByIdAndUpdate(booking.event, {
      $pull: { bookings: bookingId }
    });
    
    await User.findByIdAndUpdate(booking.user, {
      $pull: { bookings: bookingId }
    });
    
    await Booking.findByIdAndDelete(bookingId);
    
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};
