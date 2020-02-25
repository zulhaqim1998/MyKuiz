import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import TeacherHomePage from '../teacher/Home'
import QuizzesPage from '../teacher/QuizzesPage'
import QuizPage from '../teacher/QuizPage'

import * as ROUTES from '../../constants/routes';
import {withAuthentication} from '../Session';
import {makeStyles} from '@material-ui/core/styles';
import {createMuiTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';
import "./app.css";
import Box from '@material-ui/core/Box';
import Copyright from '../Copyright';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        paddingTop: theme.spacing(10)
    }
}));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#b023e4',
            contrastText: '#fff',
        }, // Purple and green play nicely together.
        secondary: {main: '#e03ae4'}, // This is just green.A700 as hex.
    },
});

const App = () => {
    const classes = useStyles();

    return <Router><ThemeProvider theme={theme}>
        <div className={classes.root}>

            <Navigation theme={theme}/>

            {/*<hr/>*/}

            <div className={classes.content}>
                <Route exact path={ROUTES.LANDING} component={LandingPage}/>
                <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
                <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
                <Route path={ROUTES.HOME} component={HomePage}/>
                <Route path={ROUTES.TEACHER_HOME} component={TeacherHomePage}/>
                <Route path={ROUTES.QUIZ_PAGE} component={QuizPage}/>
                <Route path={ROUTES.QUIZZES_PAGE} component={QuizzesPage}/>
                <Route path={ROUTES.ACCOUNT} component={AccountPage}/>
                <Route path={ROUTES.ADMIN} component={AdminPage}/>

                <Box mt={5}>
                    <Copyright/>
                </Box>
            </div>
        </div>
    </ThemeProvider>
    </Router>;
};

// const App = () => (
//   <Router>
//     <div  className={classes.root}>
//       <Navigation />
//
//       <hr />
//
//       <Route exact path={ROUTES.LANDING} component={LandingPage} />
//       <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
//       <Route path={ROUTES.SIGN_IN} component={SignInPage} />
//       <Route
//         path={ROUTES.PASSWORD_FORGET}
//         component={PasswordForgetPage}
//       />
//       <Route path={ROUTES.HOME} component={HomePage} />
//       <Route path={ROUTES.ACCOUNT} component={AccountPage} />
//       <Route path={ROUTES.ADMIN} component={AdminPage} />
//     </div>
//   </Router>
// );

export default withAuthentication(App);
