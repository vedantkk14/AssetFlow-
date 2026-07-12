import { RouteObject } from 'react-router-dom';
import BookingsListPage from './pages/BookingsListPage';
import CreateBookingPage from './pages/CreateBookingPage';

// TODO: Wrap routes with ProtectedRoute / role-based access as needed
const BookingRoutes: RouteObject[] = [
  { path: 'bookings-list', element: <BookingsListPage /> },
  { path: 'create-booking', element: <CreateBookingPage /> },
];

export default BookingRoutes;
