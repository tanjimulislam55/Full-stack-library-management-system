import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Home, LibrarianLogin, LibrarianSignup, StudentLogin, StudentSignup, PrivateRoute, AddBooks, Books, Students, StudentBooks, StudentPrivateRoute } from './components';
import { AuthProvider } from './context/authContext';
import { AuthProvider as StudentAuthProvider } from './context/authStudentContext';


const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans Mono',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  palette: {
    background: {
      default: '#fafafa00'
    }
  }
});


function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Switch>
            <Route exact path="/login/librarian" component={LibrarianLogin} />
            <Route exact path="/signup/librarian" component={LibrarianSignup} />
            <PrivateRoute exact path="/students" component={Students} />
            <PrivateRoute exact path="/books/librarian" component={Books} />
            <PrivateRoute exact path="/add_books" component={AddBooks} />
            <PrivateRoute exact path="/" component={Home} />
          </Switch>
        </AuthProvider>
        <StudentAuthProvider>
          <Switch>
            <Route exact path="/login/student" component={StudentLogin} />
            <Route exact path="/signup/student" component={StudentSignup}  />
            <StudentPrivateRoute exact path="/books/student" component={StudentBooks} />
          </Switch>
        </StudentAuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;