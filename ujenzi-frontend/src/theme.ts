import { createTheme } from '@mui/material';

export type Category = 'art' | 'coding' | 'music' | 'writing' | 'activism' | 'other';
export type Visibility = 'public' | 'private' | 'collaborative';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E8EBF7',
      contrastText: '#1A3A3A',
    },
    secondary: {
      main: '#1A3A3A',
    },
    error: {
      main: '#A2708A',
    },
    success: {
      main: '#824670',
    },
    background: {
      default: '#E8EBF7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A3A3A',
      secondary: '#824670',
    },
  },
  typography: {
    fontFamily: '"Clash Display", "Cabinet Grotesk", sans-serif',
    h1: {
      fontSize: '4rem',
      background: 'linear-gradient(45deg, #8A2BE2, #00E5FF)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '3rem',
      letterSpacing: '0.5px',
      fontWeight: 700,
    },
    h3: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontFamily: '"Cabinet Grotesk", sans-serif',
    },
    body2: {
      fontSize: '0.875rem',
      fontFamily: '"Cabinet Grotesk", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          textTransform: 'none',
          padding: '12px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #8A2BE2, #00E5FF)',
          boxShadow: '0 4px 15px rgba(138, 43, 226, 0.4)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05) rotateY(15deg)',
            boxShadow: '0 8px 25px rgba(138, 43, 226, 0.6)',
          },
        },
      },
    },
  },
});

export const getCategoryColor = (category: Category) => {
  const categoryColors = {
    art: '#FF1493',
    coding: '#00E5FF',
    music: '#8A2BE2',
    writing: '#39FF14',
    activism: '#FF5722',
    other: '#607d8b'
  };
  
  return categoryColors[category] || '#607d8b';
};

export const getGradient = (type: 'primary' | 'secondary' | 'accent') => {
  const gradients = {
    primary: 'linear-gradient(45deg, #E8EBF7, #FFFFFF)',
    secondary: 'linear-gradient(45deg, #1A3A3A, #824670)',
    accent: 'linear-gradient(45deg, #A2708A, #824670)',
  };
  return gradients[type] || gradients.primary;
};

export const getDarkGradient = () => {
  return 'linear-gradient(45deg, #1A0B2E, #182848)';
};

export default theme;
