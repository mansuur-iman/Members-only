# Members-only

A server-rendered messaging application built with Node.js, Express, and EJS.
This project focuses on authentication, session management, and role-based access control, where users, members, and admins have different permissions.

---

## Live Demo

https://members-only-821k.onrender.com/

---

## Features

### Authentication and Security

1.  User signup with validation and password hashing using bcrypt
2.  Login system implemented with Passport.js (Local Strategy)
3.  Session-based authentication with PostgreSQL session store
4.  Protected routes for authenticated users

### Role-Based Access Control

1. Visitors

- Can view messages
- Cannot see message author or timestamp

2. Members

- Gain access via a secret passcode
- Can see message author and creation date

3. Admins

- Can delete messages
- Have elevated access to moderation features

### Message System

- Authenticated users can create messages
- Users can edit their own messages
- Admins can delete messages
- Server-side validation using express-validator

---

## Key Concepts Demonstrated

- Server-side rendering (SSR) with EJS
- Authentication using Passport.js
- Session management with PostgreSQL (`connect-pg-simple`)
- Role-based authorization (user, member, admin)
- Input validation and sanitization
- Secure password storage with bcrypt
- MVC architecture (routes, controllers, database layer)
- Conditional data exposure based on user permissions

---

## System Architecture

This application follows a traditional server-side rendering architecture:

Client → Express Routes → Controllers → Database (PostgreSQL) → EJS Views

- Routes handle incoming requests
- Controllers manage business logic
- Database layer executes queries
- Views are rendered on the server and sent to the client

---

## 🗄️ Database Schema

### Users

- `id`
- `first_name`
- `last_name`
- `email` (used as username)
- `password` (hashed)
- `membership_status` (boolean)
- `admin_status` (boolean)

### Messages

- `id`
- `title`
- `text`
- `created_at`
- `user_id` (foreign key)

---

## Permission Logic

- Non-members:
  - Cannot see message author or timestamp

- Members:
  - Can view full message details

- Admins:
  - Can delete messages

Example (server-side filtering):

```js
username: req.user?.membership_status ? message.username : null;
```

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express
- **Templating:** EJS (Server-Side Rendering)
- **Database:** PostgreSQL
- **Authentication:** Passport.js
- **Sessions:** express-session + connect-pg-simple
- **Validation:** express-validator

---

## 🛠️ Installation

```bash
git clone https://github.com/mansuur-iman/Members-only.git
cd Members-only
npm install
```

Create a `.env` file:

```env
DATABASE_URL=your_postgres_connection_string
SESSION_SECRET=your_secret_key
```

Run the app:

```bash
npm start
```

---

## What I Learned

- How to build server-rendered applications using EJS
- How to implement authentication and sessions securely
- How to design systems with role-based permissions
- How to protect routes and control access to sensitive data
- How to structure a backend project using MVC

---

## Future Improvements

- Convert to REST API + frontend client (React)
- Add pagination for messages
- Implement rate limiting
- Add unit and integration tests
- Improve UI/UX

---

Author
iman
