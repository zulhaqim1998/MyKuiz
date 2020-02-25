import React from "react";
import {withFirebase} from "../../Firebase";
import {compose} from "recompose";
import {EditorState, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {stateFromHTML} from 'draft-js-import-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ToggleButton from '@material-ui/lab/ToggleButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {withStyles} from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import {withRouter} from "react-router-dom";


const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(3),
    },

});

const INITIAL_STATE = {
    questionType: "o",
    editorState: EditorState.createEmpty(),
    objectiveAnswers: [{a: "", c: false}, {a: "", c: false}],
};

class NewQuestionFormBase extends React.Component {

    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE}
    }

    componentDidMount() {
        const {isEdit, toEdit} = this.props;
        if(isEdit) {
            const contentState = stateFromHTML(toEdit.text);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState: editorState,
                objectiveAnswers: JSON.parse(JSON.stringify(toEdit.oAns)),
                questionType: toEdit.type
            });
        }
    }

    onChange = event => this.setState({[event.target.name]: event.target.value});

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSubmit = async() => {
        const {isEdit, toEdit} = this.props;
        const quizId = this.props.match.params.quizId;
        const {questionType, editorState, objectiveAnswers} = this.state;
        let formData = {};
        formData.type = questionType;
        formData.text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        formData.oAns = questionType === "o" ? objectiveAnswers : null;

        if(isEdit) {
            this.onDelete()
        }

        await this.props.firebase.quiz(quizId)
            .update({
                questions: this.props.firebase.fieldValue.arrayUnion(formData)
            })
            .then(() => {
                this.setState({...INITIAL_STATE});
                this.onDelete();
                this.props.refresh();
                this.props.onClose();
                console.log("Successfully saved new question.")
            })
            .catch(err => console.log(err));
    };

    onDelete = async() => {
        const {toEdit} = this.props;
        const quizId = this.props.match.params.quizId;
        await this.props.firebase.quiz(quizId)
            .update({
                questions: this.props.firebase.fieldValue.arrayRemove(toEdit)
            })
            .then(() => console.log("Question deleted."))
            .catch(err => console.log(err))
    };

    renderQuestionTypeSelection = () => {
        return <FormControl component="fieldset" className={this.props.classes.formControl}>
            <FormLabel component="legend">Jenis Soalan</FormLabel>
            <RadioGroup row aria-label="questionType" name="questionType" value={this.state.questionType} onChange={this.onChange}>
                <FormControlLabel
                    value="o"
                    control={<Radio color="primary" />}
                    label="Objektif"
                    labelPlacement="start"
                />
                <FormControlLabel
                    value="s"
                    control={<Radio color="primary" />}
                    label="Subjektif"
                    labelPlacement="start"
                />
            </RadioGroup>
        </FormControl>
    };

    renderQuestionEditor = () => {
        const {editorState} = this.state;
        return <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
            editorStyle={{backgroundColor: "#fff", height: 100, border: "1px solid rgba(0, 0, 0, 0.12"}}
        />
    };

    renderObjectiveTextField = (id) => <Grid container key={id} style={{marginTop: 10, marginBottom: 10}}>
        <Grid item xs={2} md={1}>
            <ToggleButton
                value="check"
                selected={this.state.objectiveAnswers[id].c}
                // className={this.props.classes.selected}
                onChange={() => {
                    // setSelected(!selected);
                    const obj = this.state.objectiveAnswers;
                    obj[id].c = !obj[id].c;
                    this.setState({objectiveAnswers: obj});
                }}
            >
                <CheckIcon/>
            </ToggleButton>
        </Grid>
        <Grid item xs={9} md={10}>
            <TextField
                id={`answer-${id}`}
                name={`answer-${id}`}
                fullWidth
                style={{backgroundColor: "#fff"}}
                multiline
                rowsMax="4"
                value={this.state.objectiveAnswers[id].a}
                onChange={(e) => {
                    const obj = this.state.objectiveAnswers;
                    obj[id].a = e.target.value;
                    this.setState({objectiveAnswers: obj});
                }}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={1}>
            <IconButton style={{color: "red"}} aria-label="delete answer" onClick={() => {
                const obj = this.state.objectiveAnswers;
                obj.splice(id, 1);
                this.setState({objectiveAnswers: obj});
            }}>
                <ClearIcon />
            </IconButton>
        </Grid>
    </Grid>;

    renderObjectiveAnswerEditor = () => {
        const {objectiveAnswers} = this.state;

        return objectiveAnswers.map((o, i) => this.renderObjectiveTextField(i));
    };

    renderAddAnswerButton = () => <Grid container style={{justifyContent: 'center'}}>
        <Button
            variant="contained"
            color="default"
            onClick={() => {
                const newAnswerArray = this.state.objectiveAnswers;
                newAnswerArray.push({a: "", c: false});
                this.setState({objectiveAnswers: newAnswerArray});
            }}
            className={this.props.classes.button}
            startIcon={<AddIcon/>}
        >
            Tambah pilihan jawapan
        </Button>
    </Grid>;

    renderButtons = () => <Grid container style={{justifyContent: 'center', marginTop: 50}}>
        {this.props.isEdit && <Button style={{backgroundColor: '#ea3d3dd4'}}
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                    this.onDelete();
                    this.props.refresh();
                    this.props.onClose();
                }}
                className={this.props.classes.button}
                startIcon={<DeleteIcon />}>
            Padam
        </Button>}
        <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={this.onSubmit}
            className={this.props.classes.button}
            startIcon={<SaveIcon />}
        >
            Simpan
        </Button>
    </Grid>;

    render() {
        const {questionType} = this.state;
        const isObjective = questionType === "o";

        return (
            <div style={{width: "100%"}}>
                {this.renderQuestionTypeSelection()}
                {this.renderQuestionEditor()}

                {isObjective && <div>
                    <p>Pilihan Jawapan:</p>
                    {this.renderObjectiveAnswerEditor()}
                    {this.renderAddAnswerButton()}
                </div>}

                {this.renderButtons()}

                {/*<textarea*/}
                {/*    disabled*/}
                {/*    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}*/}
                {/*/>*/}

                <br/>
                <br/>
                <br/>
                <br/>
                {/*<div dangerouslySetInnerHTML={{ __html: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())) }} />*/}

            </div>
        );
    }
}

export default compose(withFirebase, withStyles(styles), withRouter)(NewQuestionFormBase);
