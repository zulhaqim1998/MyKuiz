import React from "react";
import {withFirebase} from "../../Firebase";
import TextField from "@material-ui/core/TextField";
import {compose} from "recompose";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";


const styles = theme => ({
    margin: theme.spacing(2),
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    }
});

class NewClassRoomFormBase extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            section: '',
            subject: '',
            room: ''

        };
    }

    onChange = event => this.setState({[event.target.name]: event.target.value});

    handleSubmitForm = async() => {
        const {name, section, subject, room} = this.state;
        const authUser = JSON.parse(localStorage.getItem("authUser"));

        const formData = {
            nama: name,
            bahagian: section,
            subjek: subject,
            bilik: room,
            teacherId: authUser.uid,
            participants: []
        };

        await this.props.firebase.classrooms()
            .add(formData)
            .then(() => {
                this.props.refreshClassrooms();
                this.props.handleDialogClose();
            })
            .catch(error => console.log(error))
    };

    render() {
        const {classes} = this.props;
        const {name, section, subject, room} = this.state;

        return <div>
            <form noValidate autoComplete="off" className={classes.root}>
                <TextField onChange={this.onChange} label="Nama Kelas" name="name" value={name} variant="outlined" fullWidth/>
                <TextField onChange={this.onChange} label="Bahagian" name="section" value={section} variant="outlined" fullWidth/>
                <TextField onChange={this.onChange} label="Subjek" name="subject" value={subject} variant="outlined" fullWidth/>
                <TextField onChange={this.onChange} label="Bilik" name="room" value={room} variant="outlined" fullWidth/>

                <DialogActions>
                    <Button onClick={this.props.handleDialogClose} color="default">
                        Batal
                    </Button>
                    <Button onClick={this.handleSubmitForm} color="primary">
                        Daftar
                    </Button>
                </DialogActions>
            </form>
        </div>;
    }
}

export default compose(withFirebase, withStyles(styles))(NewClassRoomFormBase);
