// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e73827',
    },
    secondary: {
      main: '#5cb85c',
    },
  },
  typography: {
    // Increase the base font size (default is usually 14)
    fontSize: 16,
    fontFamily: '"Roboto", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2.25rem', fontWeight: 700 },
    h3: { fontSize: '2rem', fontWeight: 700 },
    h4: { 
      fontSize: '1.75rem', 
      fontFamily: '"Dancing Script", cursive', 
      fontWeight: 700 
    },
    h5: { fontSize: '1.5rem', fontWeight: 700 },
    h6: { fontSize: '1.25rem', fontWeight: 700 },
    button: {
      textTransform: 'none', // Prevent uppercase
      fontFamily: '"Dancing Script", cursive',
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          padding: '0.6rem 1.5rem',
        },
      },
    },
  },
});

export default theme;
