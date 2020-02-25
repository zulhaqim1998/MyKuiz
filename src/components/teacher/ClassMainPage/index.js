import React from "react";
import {withRouter} from "react-router-dom";
import {withFirebase} from "../Firebase";

class ClassMainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div>aa</div>
    }

}

export default compose(withFirebase, withRouter)(ClassMainPage);
