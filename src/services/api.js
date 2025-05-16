import axios from "axios";
import { API_CONFIG } from "../config";


const API_BASE = API_CONFIG.BASE_URL;
const ENDPOINTS = API_CONFIG.ENDPOINTS;

/**
 * API error handler
 * @param {Error} err 
 * @param {string} action 
 */
function handleApiError(err, action) {
  
  console.error(`API Error (${action}):`, err);

  let errorMsg = "Something went wrong";

  if (err.response) {
    
    const status = err.response.status;
    const serverMsg = err.response.data?.message;

    if (status === 401) {
      errorMsg = "Authentication required";
    } else if (status === 403) {
      errorMsg = "You do not have permission to perform this action";
    } else if (status === 404) {
      errorMsg = "The requested resource was not found";
    } else if (serverMsg) {
      errorMsg = serverMsg;
    }
  } else if (err.request) {
    
    errorMsg = "Server not responding. Please try again later.";
  }

  
  err.userMessage = errorMsg;

  
  throw err;
}

/**
 * Get all events
 * @returns {Promise<Array>} 
 */
export async function getEvents() {
  try {
    let res = await axios.get(`${API_BASE}${ENDPOINTS.EVENTS}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "fetching events");
  }
}

/**
 * Get event by ID
 * @param {string} eventId 
 * @returns {Promise<Object>} 
 */
export async function getEventById(eventId) {
  if (!eventId) throw new Error("Event ID is required");

  try {
    let res = await axios.get(`${API_BASE}${ENDPOINTS.EVENTS}/${eventId}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "fetching event details");
  }
}

/**
 * Create a new event (admin only)
 * @param {Object} eventData 
 * @returns {Promise<Object>} 
 */
export async function createEvent(eventData) {
  try {
    let res = await axios.post(`${API_BASE}${ENDPOINTS.EVENTS}`, eventData);
    return res.data;
  } catch (err) {
    handleApiError(err, "creating event");
  }
}

/**
 * Update an existing event (admin only)
 * @param {string} eventId 
 * @param {Object} eventData 
 * @returns {Promise<Object>}
 */
export async function updateEvent(eventId, eventData) {
  if (!eventId) throw new Error("Event ID is required");

  try {
    let res = await axios.put(
      `${API_BASE}${ENDPOINTS.EVENTS}/${eventId}`,
      eventData
    );
    return res.data;
  } catch (err) {
    handleApiError(err, "updating event");
  }
}

/**
 * Delete an event (admin only)
 * @param {string} eventId 
 * @returns {Promise<Object>} 
 */
export async function deleteEvent(eventId) {
  if (!eventId) throw new Error("Event ID is required");

  try {
    let res = await axios.delete(`${API_BASE}${ENDPOINTS.EVENTS}/${eventId}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "deleting event");
  }
}

/**
 * Book an event
 * @param {Object} bookingData 
 * @returns {Promise<Object>} 
 */
export async function createBooking(bookingData) {
 
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required to book an event");
  }

  try {
   
    if (!axios.defaults.headers.common["Authorization"]) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }

    
    let res = await axios.post(`${API_BASE}${ENDPOINTS.BOOKINGS}`, bookingData);
    return res.data;
  } catch (err) {
    
    if (err.response && err.response.status === 401) {
      throw new Error(
        "Your session has expired. Please log in again to book this event."
      );
    }
    handleApiError(err, "booking event");
  }
}

/**
 * Get current user's bookings
 * @returns {Promise<Array>} 
 */
export async function getUserBookings() {
 
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No auth token available for getUserBookings");
    return [];
  }

  try {
    
    if (!axios.defaults.headers.common["Authorization"]) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }

    let res = await axios.get(`${API_BASE}${ENDPOINTS.USER_BOOKINGS}`);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.log("Unauthorized access to bookings, returning empty array");
      return [];
    }
    handleApiError(err, "fetching user bookings");
  }
}

/**
 * Cancel a booking
 * @param {string} bookingId - The booking ID
 * @returns {Promise<Object>} Response data
 */
export async function cancelBooking(bookingId) {
  if (!bookingId) throw new Error("Booking ID is required");

  try {
    let res = await axios.delete(
      `${API_BASE}${ENDPOINTS.BOOKINGS}/${bookingId}`
    );
    return res.data;
  } catch (err) {
    handleApiError(err, "cancelling booking");
  }
}
