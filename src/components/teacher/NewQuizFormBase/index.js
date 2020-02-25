import React from "react";
import {withFirebase} from "../../Firebase";
import {compose} from "recompose";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {SUBJECTS} from "../../../constants/others";
import MenuItem from "@material-ui/core/MenuItem";
import {withRouter} from "react-router-dom";

const styles = theme => ({
    margin: theme.spacing(2),
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
    }
});

class NewQuizFormBase extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            subject: '',
        };
    }

    onChange = event => this.setState({[event.target.name]: event.target.value});

    handleSubmitForm = async() => {
        const {title, subject} = this.state;
        const authUser = JSON.parse(localStorage.getItem("authUser"));

        const formData = {
            title: title,
            subject: subject,
            teacherId: authUser.uid,
            questions: [],
            createdAt: new Date()
        };

        await this.props.firebase.quizzes()
            .add(formData)
            .then(docRef => {
                // this.props.refreshClassrooms();
                this.props.handleDialogClose();
                this.props.history.push(`/teacher/quiz/${docRef.id}`);
            })
            .catch(error => alert("Ralat berlaku. Sila cuba lagi."))
    };

    render() {
        const {classes} = this.props;
        const {name, subject} = this.state;

        return <div>
            <form noValidate autoComplete="off" className={classes.root}>
                <TextField onChange={this.onChange} label="Tajuk" name="title" value={name} fullWidth/>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel htmlFor="outlined-age-native-simple">
                        Subjek
                    </InputLabel>
                    <Select
                        value={subject}
                        onChange={this.onChange}
                        id="outlined-age-native-simple"
                        name="subject"
                    >
                        {SUBJECTS.map((subject, index) => <MenuItem key={index} value={subject}>{subject}</MenuItem>)}
                        <MenuItem  value="LAIN-LAIN">LAIN-LAIN</MenuItem >
                    </Select>
                </FormControl>
                <DialogActions>
                    <Button onClick={this.props.handleDialogClose} color="default">
                        Batal
                    </Button>
                    <Button onClick={this.handleSubmitForm} color="primary">
                        Simpan
                    </Button>
                </DialogActions>
            </form>

        </div>
    }
}

export default compose(withFirebase, withStyles(styles), withRouter)(NewQuizFormBase);
