import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import ServicesPage from './pages/ServicesPage'
import BookingFormPage from './pages/BookingFormPage'
import MyBookingsPage from './pages/MyBookingsPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ServicesPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="book/:serviceId" element={<BookingFormPage />} />
          <Route path="bookings" element={<MyBookingsPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  )
}
