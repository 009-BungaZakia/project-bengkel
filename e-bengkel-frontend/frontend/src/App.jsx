import React, { createContext, useState, useMemo } from "react"; // Tambahkan createContext & useState
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import MekanikLayout from "./layouts/MekanikLayout";
import CustomerLayout from "./layouts/CustomerLayout";

// Middleware
import PrivateRoute from "./middleware/PrivateRoute";

// Pages: Auth
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";

// Pages: Admin
import AdminDashboard from "./pages/admin/Dashboard";
import Transactions from "./pages/admin/Transactions"; 
import TransactionDetail from "./pages/admin/TransactionDetail"; 
import Users from "./pages/admin/Users";
import ManageServices from "./pages/admin/ManageServices";
import ServiceDetail from "./pages/admin/ServiceDetail";

// Pages: Customer
import CustomerDasboard from "./pages/customer/Dasboard"; 
import CustomerApproval from "./pages/customer/CustomerApproval";
import CustomerVehicles from "./pages/customer/Vehicles"; 
import CustomerHistory from "./pages/customer/History"; 

// Pages: Mekanik
import MekanikDashboard from "./pages/mekanik/Dashboard";
import MechanicJobAssignment from "./pages/mekanik/JobAssignment";
import RequestApproval from "./pages/mekanik/RequestApproval";
import MekanikProfile from "./pages/mekanik/Profile";


export const ServiceContext = createContext();

function App() {
  const [queueCount, setQueueCount] = useState(0);

 
  const contextValue = useMemo(() => ({ 
    queueCount, 
    setQueueCount 
  }), [queueCount]);

  return (
    <ServiceContext.Provider value={contextValue}> {/* Membungkus aplikasi dengan Provider */}
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- PRIVATE: ADMIN --- */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/*" element={
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  {/* Modul Baru: ManageServices */}
                  <Route path="services" element={<ManageServices />} />
                  <Route path="services/:id" element={<ServiceDetail />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="transactions/:id" element={<TransactionDetail />} />
                  <Route path="customers" element={<Users />} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </AdminLayout>
            } />
          </Route>

          {/* --- PRIVATE: MEKANIK --- */}
          <Route element={<PrivateRoute allowedRoles={['mekanik']} />}>
            <Route path="/mekanik/*" element={
              <MekanikLayout>
                <Routes>
                  <Route path="dashboard" element={<MekanikDashboard />} />
                  <Route path="job-assignment" element={<MechanicJobAssignment />} />
                  <Route path="request-approval/:id" element={<RequestApproval />} />
                  <Route path="profile" element={<MekanikProfile />} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </MekanikLayout>
            } />
          </Route>

          {/* --- PRIVATE: CUSTOMER --- */}
          <Route element={<PrivateRoute allowedRoles={['customer']} />}>
            <Route path="/customer/*" element={
              <CustomerLayout>
                <Routes>
                  <Route path="dasboard" element={<CustomerDasboard />} />
                  <Route path="vehicles" element={<CustomerVehicles />} />
                  <Route path="history" element={<CustomerHistory />} />
                  <Route path="approval/:serviceId" element={<CustomerApproval />} />
                  <Route path="*" element={<Navigate to="dasboard" />} />
                </Routes>
              </CustomerLayout>
            } />
          </Route>

          {/* --- DEFAULT REDIRECT --- */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<div className="p-20 text-center font-bold text-red-500 uppercase">404 - Halaman Tidak Ditemukan</div>} />
        </Routes> 
      </Router>
    </ServiceContext.Provider>
  );
}

export default App;