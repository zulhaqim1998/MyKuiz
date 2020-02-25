import React from "react";
import {withRouter} from "react-router-dom";
import {withFirebase} from "../../Firebase";
import {compose} from "recompose";
import {convertClassroomData, getFirebaseQueryData} from "../../../constants/helpers";
import LinearProgress from "@material-ui/core/LinearProgress";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import {withStyles} from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import NewClassRoomFormBase from "../NewClassroomFormBase";


const styles = theme => ({
    card: {
        width: "auto"
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

class ClassMainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classrooms: null,
            dialogOpen: false
        };
    }

    componentDidMount() {
        this.getClassrooms();
    }

    getClassrooms = async() => {
        const authUser = JSON.parse(localStorage.getItem("authUser"));

        this.setState({classrooms: null});
        await this.props.firebase.classrooms()
            .where("teacherId", "==", authUser.uid)
            .get()
            .then(querySnapshot => {
                const classrooms = getFirebaseQueryData(querySnapshot).map(classroom => convertClassroomData(classroom));
                this.setState({classrooms});
            });
    };

    handleDialogOpen = () => this.setState({dialogOpen: true});

    handleDialogClose = () => this.setState({dialogOpen: false});

    addClassroomCard = () => {
        const {classes} = this.props;

        return <Grid item xs={4} sm={3} md={3} lg={2} style={{cursor: "pointer"}} key={this.state.classrooms.length}>
            <Card className={classes.card} onClick={this.handleDialogOpen}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        +
                    </Typography>
                </CardContent>
                <CardActions>
                    <Typography>Tambah Kelas</Typography>
                </CardActions>
            </Card>
        </Grid>
    };

    renderClassrooms() {
        const {classes} = this.props;
        const classroomCardsList = this.state.classrooms.map((classroom, index) => <Grid key={index} item xs={4} sm={3} md={3} lg={2}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        {classroom.name[0]}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Typography>{classroom.name}</Typography>
                </CardActions>
            </Card>
        </Grid>);

        classroomCardsList.push(this.addClassroomCard());
        return classroomCardsList;
    }

    renderNewClassroomDialog = () => {
        return <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Daftar Kelas</DialogTitle>
            <DialogContent>
                <NewClassRoomFormBase handleDialogClose={this.handleDialogClose} refreshClassrooms={this.getClassrooms} />
            </DialogContent>
        </Dialog>;
    };

    render() {
        const {classrooms} = this.state;

        if (classrooms === null) {
            return <LinearProgress/>
        }

        return <div>
            <Grid container spacing={2}>{this.renderClassrooms()}</Grid>
            {this.renderNewClassroomDialog()}
            <div></div>
        </div>
    }

}

export default compose(withFirebase, withStyles(styles), withRouter)(ClassMainPage);
