import React from "react";
import {withFirebase} from "../../Firebase";
import {compose} from "recompose";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import NewQuestionFormBase from "../NewQuestionFormBase";
import {withStyles} from "@material-ui/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListIcon from '@material-ui/icons/List';
import {withAuthorization} from "../../Session";


const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    dialog: {
        padding: theme.spacing(3),
        paddingTop: theme.spacing(1)
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class QuizPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            quizData: null,
            isEdit: false,
            currentEdit: null
        };
    }

    componentDidMount() {
        this.getQuizData();
    }

    handleDialogOpen = () => this.setState({dialogOpen: true});

    handleDialogClose = () => this.setState({dialogOpen: false, isEdit: false, currentEdit: null});

    getQuizData = () => {
        const quizId = this.props.match.params.quizId;

        this.setState({quizData: null});
        this.props.firebase.quiz(quizId)
            .get()
            .then(doc => {
                const data = doc.data();
                data.id = doc.id;
                this.setState({quizData: data})
            })
            .catch(err => console.log(err));
    };

    renderQuestionsList = () => {
        const {quizData} = this.state;

        return <List component="nav" aria-label="main mailbox folders">
            {quizData.questions.map((question, index) => {
                const a = question.text.search("<p>") + 3;
                const b = question.text.search("</p>");
                let t = question.text.slice(a, b);
                t = t.length > 50 ? t.slice(0, 50) + "......." : t;

                const typeText = question.type === "o" ? "Objektif" : "Subjektif";

                return <ListItem key={index} divider button
                                 onClick={() => this.setState({currentEdit: question, isEdit: true, dialogOpen: true})}>
                    {/*<ListItemIcon>*/}
                    {/*    <ListIcon />*/}
                    {/*</ListItemIcon>*/}
                    <ListItemText primary={t} secondary={typeText}/>
                </ListItem>
            })}

        </List>
    };

    renderNewQuestionDialog = () => {
        const {classes} = this.props;
        const {dialogOpen, quizData, isEdit, currentEdit} = this.state;
        return <Dialog fullScreen open={dialogOpen} onClose={this.handleDialogClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={this.handleDialogClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {isEdit ? "Edit Soalan" : "Soalan Baru"}
                    </Typography>
                    {/*<Button autoFocus color="inherit" onClick={this.handleDialogClose}>*/}
                    {/*    Simpan*/}
                    {/*</Button>*/}
                </Toolbar>
            </AppBar>
            <div className={classes.dialog}>
                <NewQuestionFormBase onClose={this.handleDialogClose}
                                     refresh={this.getQuizData}
                                     quizId={quizData.id}
                                     toEdit={currentEdit}
                                     isEdit={isEdit}/>
            </div>
        </Dialog>
    };

    render() {
        const {quizData} = this.state;
        if (quizData === null) {
            return <LinearProgress/>
        }

        return <div>
            <Typography component="h1" variant="h5" align="left">KUIZ: {quizData.title}</Typography>
            <Typography align="right">
                <Button variant="outlined" color="primary" onClick={this.handleDialogOpen}>
                    Tambah Soalan
                </Button>
            </Typography>
            {quizData.questions.length === 0 && <Typography component="h3" align="center">Tiada soalan</Typography>}
            {this.renderQuestionsList()}
            <div>{this.renderNewQuestionDialog()}</div>

        </div>
    }
}

const condition = authUser => !!authUser;

export default compose(withFirebase, withStyles(styles), withAuthorization(condition))(QuizPage);
