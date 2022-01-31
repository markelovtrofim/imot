import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  typography: {
    body1: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      fontSize: 16,
    },
    allVariants: {
      'color': '#000000',
    },
    fontFamily: [
      'Inter'
    ].join(','),
    'fontWeightLight': 300,
    'fontWeightRegular': 400,
    'fontWeightMedium': 500,
  },
  palette: {
    primary: {
      main: "#000000",
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#545B69',
      contrastText: '#FFFFFF'
    },
  }
});

export default theme;