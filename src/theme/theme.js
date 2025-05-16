import { createTheme } from '@mui/material/styles';

// Colors from the provided image
const colors = {
  darkNavy: '#1A2027',
  navy: '#2C353D',
  taupe: '#A39684',
  sand: '#E5D6B9',
  white: '#FFFFFF',
  black: '#000000',
};

// Create light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.navy,
      dark: colors.darkNavy,
      light: colors.taupe,
    },
    secondary: {
      main: colors.taupe,
      light: colors.sand,
    },
    background: {
      default: '#f5f5f5',
      paper: colors.white,
    },
    text: {
      primary: colors.darkNavy,
      secondary: colors.navy,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.darkNavy,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: colors.taupe,
          '&:hover': {
            backgroundColor: colors.navy,
          },
        },
        outlined: {
          borderColor: colors.taupe,
          color: colors.taupe,
          '&:hover': {
            borderColor: colors.navy,
            backgroundColor: 'rgba(163, 150, 132, 0.1)',
          },
        },
      },
    },
  },
});

// Create dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.taupe,
      dark: colors.sand,
      light: colors.sand,
    },
    secondary: {
      main: colors.sand,
      light: colors.white,
    },
    background: {
      default: colors.darkNavy,
      paper: colors.navy,
    },
    text: {
      primary: colors.sand,
      secondary: colors.taupe,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.black,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: colors.taupe,
          color: colors.darkNavy,
          '&:hover': {
            backgroundColor: colors.sand,
          },
        },
        outlined: {
          borderColor: colors.taupe,
          color: colors.sand,
          '&:hover': {
            borderColor: colors.sand,
            backgroundColor: 'rgba(229, 214, 185, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.navy,
        },
      },
    },
  },
});

export const getThemeDirection = (isRtl) => {
  return {
    direction: isRtl ? 'rtl' : 'ltr',
    typography: {
      fontFamily: isRtl ? 
        '"Tajawal", "Roboto", "Helvetica", "Arial", sans-serif' : 
        '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  };
};
