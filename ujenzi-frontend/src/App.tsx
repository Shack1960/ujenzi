import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './theme';
import Layout from './components/Layout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProjectList from './components/projects/ProjectList';
import ProjectForm from './components/projects/ProjectForm';
import ProjectDetails from './components/projects/ProjectDetails';
import { RootState } from './store';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router>
          <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Layout>
                <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route
                    path="/projects"
                    element={
                      <PrivateRoute>
                        <ProjectList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/projects/new"
                    element={
                      <PrivateRoute>
                        <ProjectForm />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/projects/:id"
                    element={
                      <PrivateRoute>
                        <ProjectDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/projects" />} />
                </Routes>
              </Layout>
            </div>
          </div>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
