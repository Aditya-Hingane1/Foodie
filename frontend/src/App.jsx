import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HomeLoggedIn from './pages/HomeLoggedIn';
import RestaurantMenu from './pages/RestaurantMenu';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerOrders from './pages/CustomerOrders';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminLogin from './pages/admin/AdminLogin';

const CustomerLayout = ({ cartCount, authUser, handleLogout }) => (
  <>
    <Navbar cartCount={cartCount} authUser={authUser} handleLogout={handleLogout} />
    <Outlet />
  </>
);

function App() {
  const [cart, setCart] = useState([]);
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthUser(null);
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);

  return (
    <Router>
      <Routes>
        {/* Customer Facing Site */}
        <Route element={<CustomerLayout cartCount={cart.reduce((sum, item) => sum + item.qty, 0)} authUser={authUser} handleLogout={handleLogout} />}>
          <Route path="/" element={authUser ? <HomeLoggedIn authUser={authUser} /> : <Home />} />
          <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
          <Route path="/signup" element={<Signup setAuthUser={setAuthUser} />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu addToCart={addToCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} cartTotal={cartTotal} authUser={authUser} />} />
          <Route path="/profile" element={<CustomerOrders />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin/login" element={<AdminLogin setAuthUser={setAuthUser} />} />
        <Route path="/admin" element={<AdminLayout authUser={authUser} handleLogout={handleLogout} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
