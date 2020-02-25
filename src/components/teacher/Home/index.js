import React from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../../Session';
import ClassMainPage from "../ClassMainPage";

class TeacherHomePage extends React.Component {

    render() {
        const authUser = JSON.parse(localStorage.getItem("authUser"));

        return <div>
            <ClassMainPage />
        </div>;
    }
}

const condition = authUser => !!authUser;

export default compose(
    withAuthorization(condition),
)(TeacherHomePage);
