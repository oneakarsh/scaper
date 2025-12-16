export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'superadmin';
}

export interface Resort {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  amenities: string[];
  maxGuests: number;
  rooms: number;
  images?: string[];
}

export interface Booking {
  id: string;
  userId: string;
  resortId: string;
  resort?: Resort;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}
