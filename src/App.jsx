import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import WomenPage from './pages/WomenPage';
import MenPage from './pages/MenPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AccessoriesPage from './pages/AccessoriesPage';
import GiftCardPage from './pages/GiftCardPage';
import ToysPage from './pages/ToysPage';
import HomewarePage from './pages/HomewarePage';
import KidsPage from './pages/KidsPage';

// Placeholders for remaining sections
const OffersPage = () => <div style={{ padding: '100px 40px', textTransform: 'uppercase', fontWeight: 700 }}>Exclusive Offers Coming Soon</div>;

// 💡 DYNAMIC ROUTER CONTROLLER:

function ProductRouteController() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  if (category === 'men') {
    return <MenPage />;
  }
  if (category === 'accessories') {
    return <AccessoriesPage />;
  }
  if (category === 'toys') {
    return <ToysPage />;
  }
  if (category === 'homeware') {
    return <HomewarePage />;
  }
  if (category === 'kids') {
    return <KidsPage />;
  }

  return <WomenPage />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* Navbar Component */}
            <Navbar />

            {/* Page Content Area */}
            <main style={{ flex: 1, paddingTop: '64px' }}>
              <Routes>
                {/* 1. HOME */}
                <Route path="/" element={<HomePage />} />

                {/* 2. DYNAMIC PRODUCTS LINK HANDLING (Women/Men separation fix) */}
                <Route path="/products" element={<ProductRouteController />} />

                {/* Direct paths support */}
                <Route path="/women" element={<WomenPage />} />
                <Route path="/men"   element={<MenPage />} />
                <Route path="/kids"  element={<KidsPage />} />
                <Route path="/toys"  element={<ToysPage />} />

                {/* Product detail page */}
                <Route path="/product/:id" element={<ProductDetailPage />} />

                {/* 3. OTHER SECTIONS */}
                <Route path="/accessories" element={<AccessoriesPage />} />
                <Route path="/homeware" element={<HomewarePage />} />
                <Route path="/gift-cards" element={<GiftCardPage />} />
                <Route path="/offers" element={<OffersPage />} />
                

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer Component */}
            <Footer />
          </div>

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