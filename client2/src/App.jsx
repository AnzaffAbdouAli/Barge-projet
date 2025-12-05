import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminContactMessages from "./pages/admin/AdminContactMessages";
import AdminContent from "./pages/admin/AdminContent";
import ProtectedRoute from "./components/admin/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/projets" element={<Projects />} />
        <Route path="/projets/:id" element={<ProjectDetail />} />
        <Route path="/equipe" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="projets" element={<AdminProjects />} />
        <Route path="equipe" element={<AdminTeam />} />
        <Route path="contact-messages" element={<AdminContactMessages />} />
        <Route path="content" element={<AdminContent />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
