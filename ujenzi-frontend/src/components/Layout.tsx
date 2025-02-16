import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
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
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Ujenzi
          </Typography>
          {user ? (
            <>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() => navigate('/projects')}
              >
                Projects
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() => navigate('/profile')}
              >
                Profile
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={handleLogout}
              >
                Logout
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() => navigate('/login')}
              >
                Login
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() => navigate('/register')}
              >
                Register
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>
      <main>
        {children}
        <footer>
          <Typography variant="body1" align="center">
            {' '}
            {'Copyright '}
            {new Date().getFullYear()} Ujenzi
          </Typography>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
