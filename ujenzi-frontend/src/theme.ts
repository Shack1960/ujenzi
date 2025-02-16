import { createTheme } from '@mui/material';

export type Category = 'art' | 'coding' | 'music' | 'writing' | 'activism' | 'other';
export type Visibility = 'public' | 'private' | 'collaborative';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export const getCategoryColor = (category: Category) => {
  const categoryColors = {
    art: '#ff5722',
    coding: '#2196f3', 
    music: '#9c27b0',
    writing: '#4caf50',
    activism: '#f44336',
    other: '#607d8b'
  };
  
  return categoryColors[category] || '#607d8b';
};

export default theme;
