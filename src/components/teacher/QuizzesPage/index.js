import React from "react";
import {withFirebase} from "../../Firebase";
import {compose} from "recompose";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import NewQuizFormBase from "../NewQuizFormBase";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import AddIcon from '@material-ui/icons/Add';
import {withAuthorization} from "../../Session";


class QuizzesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            data: null
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = async() => {
        const authUser = JSON.parse(localStorage.getItem("authUser"));

        this.setState({classrooms: null});
        await this.props.firebase.quizzes()
            .where("teacherId", "==", authUser.uid)
            .get()
            .then(querySnapshot => {
                let data = [];
                querySnapshot.forEach(doc => {
                    const d = doc.data();
                    d.id = doc.id;
                    data.push(d);
                });
                this.setState({data});
            });
    };

    handleDialogOpen = () => this.setState({dialogOpen: true});

    handleDialogClose = () => this.setState({dialogOpen: false});

    renderQuizList = () => {
        const {data} = this.state;
        return <List component="nav" aria-label="main mailbox folders">
            {data.map((quiz, index) => {

                const text2 = `${String(quiz.questions.length)} SOALAN`;

                return <ListItem key={index} divider button component="a" href={`/teacher/quiz/${quiz.id}`} >
                    <ListItemText primary={quiz.title} secondary={`${text2} - ${quiz.subject}`} />
                </ListItem>
            })}

        </List>
    };

    renderNewQuizDialog = () => {
        return <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Kuiz Baru</DialogTitle>
            <DialogContent>
                <NewQuizFormBase handleDialogClose={this.handleDialogClose} />
            </DialogContent>
        </Dialog>;
    };

    render() {
        const {data} = this.state;
        if(data === null) {
            return <LinearProgress/>
        }

        return <div>
            <Typography component="h1" variant="h5" align="left">KUIZ</Typography>
            <Typography align="right">
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={this.handleDialogOpen}
                    // className={this.props.classes.button}
                    startIcon={<AddIcon />}
                >
                    Kuiz Baru
                </Button>
            </Typography>
            {data.length === 0 && <Typography component="h3" align="center">Tiada kuiz.</Typography>}
            {this.renderQuizList()}

            {this.renderNewQuizDialog()}

        </div>
    }
}

const condition = authUser => !!authUser;

export default compose(withFirebase, withAuthorization(condition))(QuizzesPage);
