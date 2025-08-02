import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import SupervisionDashboard from "@/pages/SupervisionDashboard";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // 默认已登录，实际项目中应根据认证状态设置

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/supervision" replace />} />
        <Route path="/supervision" element={<SupervisionDashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </AuthContext.Provider>
  );
}

