# Event Booking System

A full-stack event booking application that allows users to browse events, book tickets, and manage their bookings. The application also includes an admin panel for event management.
## admin account
email: admin@event.com
password: admin123

## Features

- User authentication (register, login)
- Browse events in a grid/flexbox layout
- View event details
- Book tickets for events
- View and manage bookings
- Admin panel for event management (CRUD operations)

## Tech Stack

- **Frontend**: React, React Router, Material-UI, Axios
- **Backend**: Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/event-booking
   JWT_SECRET=p8Kj5tQm2RvZ7xYc3FbN1sA6dE9gH4wL
   ```

### Running the Application

To run both the frontend and backend concurrently:

```
npm run start
```

To run only the frontend:

```
npm run dev
```

To run only the backend:

```
npm run dev:server
```



### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event (admin only)
- `PUT /api/events/:id` - Update an event (admin only)
- `DELETE /api/events/:id` - Delete an event (admin only)

### Bookings

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/user` - Get all bookings for the logged-in user
- `DELETE /api/bookings/:id` - Cancel a booking
