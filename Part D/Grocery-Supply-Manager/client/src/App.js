import './App.css';
import HomePage from "./pages/HomePage";
import Register from './pages/Register';
import SupplierDashboard from './pages/SupplierDashboard';
import AdminDashboard from './pages/admin/AdminDashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateOrder from './pages/admin/CreateOrder';
//import OrdersList from './pages/admin/OrdersList';
import OrderManagement from './pages/admin/OrderManagement';
import SingleOrderPage from './pages/admin/SingleOrderPage'
import NotificationsPage from './pages/admin/NotificationsPage'
// import OrderStatus from './pages/admin/OrderStatus';
// import ConfirmDelivery from './pages/admin/ConfirmDelivery';
// import OrdersArchive from './pages/admin/OrdersArchive';


function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />

        <Route path="/orders/:orderId" element={<SingleOrderPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-order" element={<CreateOrder />} />
        <Route path="/admin/orders-management" element={<OrderManagement />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

