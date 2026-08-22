import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import WomenPage from './pages/WomenPage';
import ProductDetailPage from './pages/ProductDetailPage';
import GiftCardPage from './pages/GiftCardPage';
import OffersPage from './pages/OfferPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import AdminDasboardPage from './pages/AdminDasboardPage';
import CheckoutPage from './pages/CheckoutPage';
import SareePage from './pages/SareePage';


function AppLayout() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDasboardPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar Component */}
      <Navbar />

      {/* Page Content Area */}
      <main style={{ flex: 1, paddingTop: '64px' }}>
        <Routes>
          {/* 1. HOME */}
          <Route path="/" element={<HomePage />} />

          {/* 2. PRODUCTS */}
          <Route path="/products" element={<WomenPage />} />

          {/* Direct paths */}
          <Route path="/women" element={<WomenPage />} />
          <Route path="/saree" element={<SareePage />} />

          {/* Product detail page */}
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* 3. OTHER SECTIONS */}
          <Route path="/gift-cards" element={<GiftCardPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Catch-all: redirect old beauty/accessories paths to home */}
          <Route path="/beauty" element={<Navigate to="/" replace />} />
          <Route path="/accessories" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppLayout />

          {/* Toast Notification Container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333333',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: '500',
                letterSpacing: '0.02em',
                padding: '12px 20px',
              },
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;