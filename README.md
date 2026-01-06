# Scaper - Resort Booking Platform

A modern, responsive web application for booking resort getaways built with **Next.js 16**, **React**, **TypeScript**, and **Tailwind CSS**.

## Overview

Scaper is a comprehensive resort booking platform that allows users to discover, book, and manage resort stays. The application features user authentication, role-based access control, and an admin dashboard for managing bookings.

## Features

### 🏠 Home Page
- Attractive hero section with call-to-action
- Featured resorts carousel
- Why choose Scaper section highlighting key benefits

### 🏖️ Resorts
- Browse all available resorts with detailed information
- Advanced filter and search functionality (location, amenities, price range)
- Resort details including amenities, pricing, and images
- Quick booking dialog for instant reservations

### 🔐 Authentication
- Secure user registration and login
- JWT token-based authentication
- Role-based access control (User, Admin, SuperAdmin)
- Persistent login sessions

### 📅 Bookings
- Create new bookings with date selection
- View all personal bookings with status tracking
- Cancel bookings (subject to policies)
- Booking history and management

### 👤 User Profile
- View and manage profile information
- Display user role and account details
- Secure logout functionality

### ⚙️ Admin Dashboard
- View all bookings across the platform (Admin/SuperAdmin only)
- Update booking statuses
- Manage resort availability and bookings
- User management capabilities

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Framework**: Tailwind CSS v4
- **Language**: TypeScript
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Authentication**: JWT tokens
- **Styling**: Utility-first CSS with Tailwind
#
## Project Structure

```
src/
├── app/
│   ├── globals.css           # Global styles with Tailwind directives
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Home page
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── booking/
│   │   └── [_id]/
│   │       └── page.tsx      # Individual booking page
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── register/
│   │   └── page.tsx          # Registration page
│   └── resorts/
│       └── page.tsx          # Resorts listing page
├── components/
│   ├── AdvancedFilters.tsx   # Advanced search filters
│   ├── Layout.tsx            # Main layout wrapper
│   ├── LoginDialog.tsx       # Login modal component
│   ├── MuiProvider.tsx       # Theme provider (deprecated)
│   ├── Navbar.tsx            # Navigation bar
│   ├── RegisterDialog.tsx    # Registration modal
│   ├── ResortCard.tsx        # Resort card component
│   ├── SearchBar.tsx         # Search bar component
│   └── UserMenu.tsx          # User dropdown menu
├── lib/
│   ├── api.ts                # Axios API client configuration
│   └── auth.ts               # Authentication utilities
└── types/
    └── index.ts              # TypeScript type definitions
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scaper
```

2. Install dependencies:
```bash
npm install
```

## Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Replace `http://localhost:5000/api` with your backend API URL.

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build & Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Integration

The application expects a REST API backend with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Resorts
- `GET /resorts` - Get all resorts
- `GET /resorts/:id` - Get resort details

### Bookings
- `GET /bookings` - Get user bookings
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

### Admin
- `GET /admin/bookings` - Get all bookings (admin only)
- `PUT /admin/bookings/:id/status` - Update booking status

## User Roles

- **User**: Can browse resorts, make bookings, view own bookings
- **Admin**: All user permissions + view all bookings, update booking statuses
- **SuperAdmin**: All admin permissions + additional administrative controls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
