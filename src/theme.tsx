import {createTheme} from '@mui/material/styles';

const theme = createTheme({

  typography: {
    body1: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      fontSize: 14,
    },
    allVariants: {
      fontFamily: "Inter, sans-serif",
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
      main: '#722ED1',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: "#EFDBFF",
    },
  }
});

export default theme;