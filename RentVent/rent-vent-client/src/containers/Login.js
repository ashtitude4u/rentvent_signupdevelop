import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import SocialButton from "../components/SocialButton";
import config from "../config";
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleSocialLogin = (user) => {
    console.log(user)
  }

  handleSocialLoginFailure = (err) => {
    console.error(err)
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await this.login(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });

      // dummy login for testing purpose
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    }
  }

  login(email, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
        <div className="social-buttons">
        <SocialButton
                provider='facebook'
                appId={config.facebook.APP_ID}
                onLoginSuccess={this.handleSocialLogin}
                onLoginFailure={this.handleSocialLoginFailure}
              >
                Login with Facebook
        </SocialButton>
        <SocialButton
                provider='google'
                appId={config.google.APP_ID}
                onLoginSuccess={this.handleSocialLogin}
                onLoginFailure={this.handleSocialLoginFailure}
              >
                Login with Google
        </SocialButton>
        </div>
      </div>
    );
  }
}