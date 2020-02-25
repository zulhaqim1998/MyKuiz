import React from "react";

class StudentSignUp extends React.Component {

    render() {
        const {
            username,
            phone,
            code,
            error,
        } = this.state;

        const isInvalid = username === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                />
                <input
                    name="phone"
                    value={phone}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Phone Number"
                />
                <input
                    name="code"
                    value={code}
                    onChange={this.onChange}
                    type="number"
                    placeholder="Verification Code"
                />
                {/*<input*/}
                {/*    name="passwordOne"*/}
                {/*    value={passwordOne}*/}
                {/*    onChange={this.onChange}*/}
                {/*    type="password"*/}
                {/*    placeholder="Password"*/}
                {/*/>*/}
                {/*<input*/}
                {/*    name="passwordTwo"*/}
                {/*    value={passwordTwo}*/}
                {/*    onChange={this.onChange}*/}
                {/*    type="password"*/}
                {/*    placeholder="Confirm Password"*/}
                {/*/>*/}
                <button disabled={isInvalid} type="submit">
                    Sign Up
                </button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}
