# Quick Start Guide - Scaper UI

## Prerequisites
- Node.js 18+ and npm installed
- Backend API running on `http://localhost:5000`

## Setup Steps

### 1. Install Dependencies
```bash
cd c:\Users\akarsh.ramesh\scaper
npm install
```

### 2. Create Environment File
Create `.env.local` in the project root:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Backend Connection

Make sure your backend API is running and accessible at `http://localhost:5000/api`

The frontend expects these endpoints:
- POST `/auth/register` - User registration
- POST `/auth/login` - User login
- GET `/auth/profile` - Get user profile
- GET `/resorts` - List all resorts
- POST `/bookings` - Create booking
- GET `/bookings` - Get user bookings
- And more...

## Project Pages

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Home page | No |
| `/login` | Login page | No |
| `/register` | Registration page | No |
| `/resorts` | Browse all resorts | No |
| `/bookings` | My bookings | Yes |
| `/profile` | User profile | Yes |
| `/admin` | Admin dashboard | Yes (Admin+) |

## Common Tasks

### View All Resorts
1. Go to http://localhost:3000/resorts
2. Browse available resorts
3. Click "Book Now" to start booking

### Make a Booking
1. Login or register at /login or /register
2. Go to Resorts page
3. Click "Book Now" on a resort
4. Enter dates and number of guests
5. Complete the booking

### Access Admin Panel
1. Login with an admin account
2. Click your name in navbar
3. Select "Admin Panel"
4. View and manage all bookings

## Troubleshooting

### "API Connection Failed"
- Check if backend is running at http://localhost:5000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for errors (F12)

### "Cannot find module" errors
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`
- Restart dev server

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## Project Structure

```
scaper/
├── src/
│   ├── app/           # Next.js pages
│   ├── components/    # Reusable components
│   ├── lib/           # Utilities (API, auth)
│   └── types/         # TypeScript types
├── public/            # Static assets
├── .env.example       # Example env file
└── package.json       # Dependencies
```

## Key Files to Know

- `src/lib/api.ts` - All API endpoint definitions
- `src/lib/auth.ts` - Authentication helper functions
- `src/components/Navbar.tsx` - Main navigation
- `src/app/page.tsx` - Home page

## Next Steps

1. ✅ Start the development server
2. ✅ Register a new user account
3. ✅ Browse and book a resort
4. ✅ View your bookings
5. ✅ Create an admin account to test admin features

## Need Help?

- Check the main README.md
- Review component files in `src/components/`
- Check API definitions in `src/lib/api.ts`
- Review types in `src/types/index.ts`

Happy booking! 🏨
