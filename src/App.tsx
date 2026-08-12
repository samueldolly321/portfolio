import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import { PortfolioPage } from './pages/PortfolioPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminHero } from './pages/admin/AdminHero';
import { AdminAbout } from './pages/admin/AdminAbout';
import { AdminSkills } from './pages/admin/AdminSkills';
import { AdminExperiences } from './pages/admin/AdminExperiences';
import { AdminEducation } from './pages/admin/AdminEducation';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminProjectEdit } from './pages/admin/AdminProjectEdit';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Portfolio Route */}
              <Route path="/" element={<PortfolioPage />} />

              {/* Admin Login Route */}
              <Route path="/admin/user" element={<AdminLogin />} />

              {/* Protected CMS Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="hero" element={<AdminHero />} />
                  <Route path="about" element={<AdminAbout />} />
                  <Route path="skills" element={<AdminSkills />} />
                  <Route path="experiences" element={<AdminExperiences />} />
                  <Route path="education" element={<AdminEducation />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="projects/new" element={<AdminProjectEdit />} />
                  <Route path="projects/edit/:id" element={<AdminProjectEdit />} />
                  <Route path="media" element={<AdminMedia />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                </Route>
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
