# Scaper - Resort Booking UI

A modern, responsive web application for booking resort getaways built with **Next.js 16**, **React**, and **Material-UI (MUI)**.

## Features

###  Home Page
- Attractive hero section with call-to-action
- Featured resorts carousel
- Why choose Scaper section with key benefits

###  Resorts
- Browse all available resorts
- Filter and search functionality
- Resort details with amenities and pricing
- Quick booking dialog

###  Authentication
- User registration
- User login
- JWT token management
- Role-based access control (User, Admin, SuperAdmin)

###  Bookings
- Create new bookings
- View all personal bookings
- Cancel bookings
- Booking status tracking

###  User Profile
- View profile information
- User role display
- Logout functionality

###  Admin Dashboard
- View all bookings (Admin only)
- Update booking status
- Manage resort bookings

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: Material-UI (MUI) v6
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Styling**: MUI System + CSS-in-JS

## Project Structure

`
src/
 app/
    page.tsx              # Home page
    layout.tsx            # Root layout
    globals.css           # Global styles
    login/page.tsx        # Login page
    register/page.tsx     # Registration page
    resorts/page.tsx      # Resorts listing
    bookings/page.tsx     # My bookings page
    profile/page.tsx      # User profile page
    admin/page.tsx        # Admin dashboard
 components/
    Layout.tsx            # Main layout wrapper
    Navbar.tsx            # Navigation bar
    MuiProvider.tsx       # Material-UI theme provider
    ResortCard.tsx        # Resort card component
 lib/
    api.ts                # Axios API client
    auth.ts               # Authentication utilities
 types/
     index.ts              # TypeScript types
`

## Installation

`ash
cd scaper
npm install
`

## Environment Setup

Create .env.local:
`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
`

## Development

`ash
npm run dev
`

Open [http://localhost:3000](http://localhost:3000)

## Build & Production

`ash
npm run build
npm start
`

## Features

-  Next.js 16 with TypeScript
-  Material-UI components
-  JWT authentication
-  Axios HTTP client
-  Role-based access control
-  Responsive design
-  Admin dashboard
-  Booking management
