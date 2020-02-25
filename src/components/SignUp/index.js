import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {compose} from 'recompose';
import {withStyles} from '@material-ui/styles';
import Select from "@material-ui/core/Select";
import BootstrapInput from "../BootstrapInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {malaysia_states} from "../../constants/others";
import InputLabel from "@material-ui/core/InputLabel";

const SignUpPage = () => (
    <div>
        {/*<h1>SignUp</h1>*/}
        <SignUpForm/>
    </div>
);

const INITIAL_STATE = {
    fullName: '',
    email: '',
    ic: '',
    passwordOne: '',
    passwordTwo: '',
    state: '',
    school: '',
    isAdmin: false,
    error: null,
    role: 'teacher'
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },

    formControl: {
        margin: theme.spacing(1),
        width: "100%"
    },
});

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onSubmit = event => {
        const {fullName, email, ic, state, school, passwordOne, passwordTwo, role} = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            fullName === '';

        if (isInvalid) {
            return alert("Please enter required information.");
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // Create a user in your Firebase realtime database
                return this.props.firebase.user(authUser.user.uid).set(
                    {
                        fullName,
                        email,
                        ic,
                        state,
                        school,
                        role

                    },
                    {merge: true},
                );
            })
            .then(() => {
                this.setState({...INITIAL_STATE});
                this.props.history.push(role === 'teacher' ? ROUTES.TEACHER_HOME : ROUTES.HOME);
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({error});
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    inIcInputChange = event => {
        const {name, value} = event.target;

        if (!(value < 0 || String(value).length > 12)) {
            this.setState({[name]: value});
        }

    };

    onChangeCheckbox = event => {
        this.setState({[event.target.name]: event.target.checked});
    };

    render() {
        const {
            fullName,
            email,
            ic,
            state,
            school,
            passwordOne,
            passwordTwo,
        } = this.state;

        const {classes} = this.props;
        // return (
        //   <form onSubmit={this.onSubmit}>
        //     <input
        //       name="username"
        //       value={username}
        //       onChange={this.onChange}
        //       type="text"
        //       placeholder="Full Name"
        //     />
        //     <input
        //       name="email"
        //       value={email}
        //       onChange={this.onChange}
        //       type="text"
        //       placeholder="Email Address"
        //     />
        //     <input
        //       name="passwordOne"
        //       value={passwordOne}
        //       onChange={this.onChange}
        //       type="password"
        //       placeholder="Password"
        //     />
        //     <input
        //       name="passwordTwo"
        //       value={passwordTwo}
        //       onChange={this.onChange}
        //       type="password"
        //       placeholder="Confirm Password"
        //     />
        //     <label>
        //       Admin:
        //       <input
        //         name="isAdmin"
        //         type="checkbox"
        //         checked={isAdmin}
        //         onChange={this.onChangeCheckbox}
        //       />
        //     </label>
        //     <button disabled={isInvalid} type="submit">
        //       Sign Up
        //     </button>
        //
        //     {error && <p>{error.message}</p>}
        //   </form>
        // );

        // render() {

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Daftar Akaun
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="fname"
                                    name="fullName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="fullName"
                                    label="Nama penuh"
                                    value={fullName}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="ic"
                                    type="number"
                                    name="ic"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="ic"
                                    label="Nombor kad pengenalan"
                                    value={ic}
                                    onChange={this.inIcInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Alamat e-mel"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            {/*<Grid xs={12}>*/}
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="state-select-label">Negeri *</InputLabel>
                                <Select
                                    labelId="state-select-label"
                                    id="state-select"
                                    name="state"
                                    value={state}
                                    onChange={this.onChange}
                                    labelWidth={40}
                                    required
                                >
                                    {Object.keys(malaysia_states).sort().map(key => <MenuItem key={key}
                                                                                              value={key}>{malaysia_states[key]}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="school"
                                    name="school"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="school"
                                    label="Sekolah"
                                    value={school}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="passwordOne"
                                    label="Kata laluan"
                                    type="password"
                                    id="passwordOne"
                                    autoComplete="current-password"
                                    value={passwordOne}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="passwordTwo"
                                    label="Sahkan kata laluan"
                                    type="password"
                                    id="passwordTwo"
                                    autoComplete="current-password"
                                    value={passwordTwo}
                                    onChange={this.onChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.onSubmit}
                        >
                            Daftar
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href={ROUTES.SIGN_IN} variant="body2">
                                    Sudah mempunyai akaun? Log masuk.
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>

            </Container>
        );

    }
}


const SignUpForm = compose(withRouter, withFirebase, withStyles(styles))(SignUpFormBase); // withRouter(withFirebase(SignUp));

export default SignUpPage;

export {SignUpForm};
