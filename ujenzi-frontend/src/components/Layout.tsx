import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      <AppBar position="static" sx={{ 
        background: '#E8EBF7',
        boxShadow: '0 4px 20px rgba(26, 58, 58, 0.3)'
      }}>
        <Toolbar>
          <Typography
            variant="h2"
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontFamily: 'Clash Display',
              color: '#1A3A3A',
              fontWeight: 700,
              fontSize: '2.5rem'
            }}
            onClick={() => navigate('/')}
          >
            Ujenzi
          </Typography>
          {user ? (
            <>
              <Button
                variant="text"
                sx={{ 
                  mx: 2,
                  color: '#1A3A3A',
                  '&:hover': {
                    background: 'rgba(162, 112, 138, 0.1)',
                    transform: 'scale(1.05)'
                  }
                }}
                onClick={() => navigate('/projects')}
              >
                Projects
              </Button>
              <Button
                variant="text"
                sx={{ 
                  mx: 2,
                  color: '#1A3A3A',
                  '&:hover': {
                    background: 'rgba(162, 112, 138, 0.1)',
                    transform: 'scale(1.05)'
                  }
                }}
                onClick={() => navigate('/profile')}
              >
                Profile
              </Button>
              <Button
                variant="text"
                sx={{ 
                  mx: 2,
                  color: '#1A3A3A',
                  '&:hover': {
                    background: 'rgba(162, 112, 138, 0.1)',
                    transform: 'scale(1.05)'
                  }
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                sx={{ 
                  mx: 2,
                  background: '#A2708A',
                  color: '#E8EBF7',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 5px 20px rgba(162, 112, 138, 0.5)'
                  }
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ 
                  mx: 2,
                  background: '#824670',
                  color: '#E8EBF7',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 5px 20px rgba(130, 70, 112, 0.5)'
                  }
                }}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <main style={{ minHeight: 'calc(100vh - 128px)' }}>
        {children}
        <footer style={{ 
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          marginTop: '2rem'
        }}>
          <Typography 
            variant="body1" 
            align="center"
            sx={{ color: '#1A3A3A' }}
          >
            {'Copyright '}
            {new Date().getFullYear()} Ujenzi
          </Typography>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
