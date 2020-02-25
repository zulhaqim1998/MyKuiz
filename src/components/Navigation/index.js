import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {AppBar, Toolbar, IconButton, Typography, Button} from '@material-ui/core';

import {AuthUserContext} from '../Session';
// import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import {AccountCircle} from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {withFirebase} from '../Firebase';
import {compose} from 'recompose';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import * as ROLES from "../../constants/roles";
import Avatar from "@material-ui/core/Avatar";
import HomeIcon from '@material-ui/icons/Home';
import ClassIcon from '@material-ui/icons/Class';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';


const drawerWidth = 240;


const useStyles = makeStyles(theme => ({
    // menuButton: {
    //     marginRight: theme.spacing(2),
    // },
    title: {
        flexGrow: 1,
        fontWeight: "bold",
        fontSize: "1.7rem"
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    appBarNonAuth: {
      [theme.breakpoints.up('sm')]: {
        width: '100%',
        //marginLeft: 0,
      },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        padding: 50,
        margin: 50,
        ...theme.mixins.toolbar,
        // justifyContent: 'flex-end',
    },
    bigAvatar: {
        width: 50,
        height: 50,
        // marginLeft: 'auto',
        // marginRight: 'auto'
    },
}));

const Navigation = ({...props}) => (
    <AuthUserContext.Consumer>
        {authUser => authUser ?
            <NewNavigationAuth theme={props.theme} authUser={authUser}
                               history={props.history} firebase={props.firebase}/> :
            <NewNavigationNonAuth authUser={authUser} theme={props.theme}
                                  history={props.history} firebase={props.firebase}/>

        }
    </AuthUserContext.Consumer>
);


function NewNavigationNonAuth({...props}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBarNonAuth}>
                <Toolbar>
                    <Typography component="h1" variant="h5" className={classes.title}>
                        <Link to={ROUTES.LANDING}>MyKuiz</Link>
                    </Typography>

                    {props.authUser ? (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => {
                                    props.history.push(ROUTES.HOME);
                                    handleClose()
                                }}>Home</MenuItem>

                                <MenuItem onClick={() => {
                                    props.history.push(ROUTES.ACCOUNT);
                                    handleClose();
                                }}>My account</MenuItem>
                                <MenuItem onClick={() => {
                                    props.firebase.doSignOut();
                                    handleClose();
                                }}>Sign out</MenuItem>
                            </Menu>
                        </div>
                    ) : <div>
                        <Link to={ROUTES.SIGN_IN}><Button color="inherit">Log Masuk</Button></Link>
                        <Link to={ROUTES.SIGN_UP}><Button color="inherit">Daftar</Button></Link>
                    </div>}
                </Toolbar>
            </AppBar>
        </div>
    );
};


function NewNavigationAuth({...props}) {
    const role = props.authUser.role;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const {container} = props;
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>

            <ListItem>
                <ListItemIcon>
                    <Avatar //alt="Remy Sharp" src="/static/images/avatar/1.jpg"
                        className={classes.bigAvatar}>{props.authUser.fullName[0]}</Avatar>
                </ListItemIcon>
                <ListItemText primary={props.authUser.fullName}/>
            </ListItem>
            <Divider/>
            <List component="a" href="/teacher/home">
                <ListItem button>
                    <ListItemIcon>
                        <HomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"Kelas"}/>
                </ListItem>
            </List>
            <Divider/>
            <List component="a" href="/teacher/quizzes">
                <ListItem button>
                    <ListItemIcon>
                        <ClassIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"Soalan"}/>
                </ListItem>
            </List>
            <Divider/>
            <List component="a" href={ROUTES.ACCOUNT}>
                <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"Akaun saya"}/>
                </ListItem>
            </List>
            <Divider/>
            <List component="a" href={""}>
                <ListItem button style={{backgroundColor: '#eaeaea'}} onClick={() => {
                    props.firebase.doSignOut();
                }}>
                    <ListItemIcon>
                        <PowerSettingsNewIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"Log keluar"}/>
                </ListItem>
            </List>
            <Divider/>

        </div>
    );

    return (
        <div>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h5" className={classes.title}>
                        <Link to={ROUTES.LANDING}>MyKuiz</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
}


export default compose(withRouter, withFirebase)(Navigation);
