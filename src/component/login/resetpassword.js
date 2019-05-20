import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { Link } from "react-router-dom";
import Validator, { ValidationTypes } from "js-object-validation";
import { toast } from "react-toastify";
import { Button,FormLabel, FormGroup,Col,Row, FormControl} from "react-bootstrap";
const loading = {
  margin: "1em",
  fontSize: "24px"
};

export default class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      value: "",
      password: "",
      updated: false,
      isLoading: true,
      error: false,
      errors: {},
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/product-list");
    }
    await axios
      .get("http://192.168.2.146:8080/reset/" + this.props.match.params.token)
      .then(response => {
        // console.log("response.data.message");
        // console.log(response.data.message);
        console.log(response);

        if (response.data.success === true) {
          this.setState({
            email: response.data.email,
            updated: false,
            isLoading: false,
            error: false,
            value: response.data.success
          });
        }
        console.log("success");
        console.log(response.data.success);
      })
      .catch(error => {
        console.log(error.response.data);
        this.setState({
          updated: false,
          isLoading: false,
          error: true
        });
      });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };



  updatePassword = e => {
    e.preventDefault();
    this.setState({
      errors: {}
    })
    try {
      const {  password, cpassword } = this.state;
      const obj = {  password, cpassword }
      const validations = {
        
        password: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.PASSWORD]: true,
          [ValidationTypes.MINLENGTH]: 8,
        },
        cpassword: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.EQUAL]: "password"
        }
      };
      const messages = {
        
        password: {
          [ValidationTypes.REQUIRED]: "Please enter password.",
          [ValidationTypes.MINLENGTH]: "Please enter at least 8 characters.",
        },
        cpassword: {
          [ValidationTypes.REQUIRED]: "Please enter confirm password.",
          [ValidationTypes.EQUAL]: "Password and confirm password didn't match"
        }
      };
      const { isValid, errors } = Validator(obj, validations, messages);
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }
     axios.put("http://192.168.2.146:8080/updatePasswordViaEmail", {
        email: this.state.email,
        resetPasswordToken: this.props.match.params.token,
        password: this.state.password
      })
      .then(response => {
        console.log(response.data);
        if (response.data.success === true) {
          this.setState({
            updated: true,
            error: false
          });
          toast.success("Password updated successfully")
          this.props.history.push("/login")
        } else {
          this.setState({
            updated: false,
            error: true
          });
        }
      })
    }catch (error) {
        console.log(error)
        this.setState({ isLoading: false });
        toast.error(`${(error.response && error.response.data && error.response.data.message[0].msg) || "Unknown error"}`);
        this.props.history.push("/signup")
  
      }
  };
  onInputChange = e => {
    const { target } = e;
    const { value, name } = target;
    this.setState({
      [name]: value
    });
  };



  render() {
    const { password, isLoading, cpassword, value ,errors } = this.state;
    const {
      password: passwordError,
      cpassword: cpasswordError,
    } = errors;
    if (value === false) {
      return (
        <>
          
          <div className="auth-box">
            <div style={loading}>
              <h4>
                Problem resetting password. Please send another reset link.
              </h4>
              <Link to={"/"}>
                <Button>Go Home</Button>
              </Link>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <Link to={"/forgot-password"}>
                <Button>Forgot Password</Button>
              </Link>
            </div>
          </div>
        </>
      );
    }
    if (isLoading) {
      return (
        <>
          <div>
            <div style={loading}>Loading User Data...</div>
          </div>
        </>
      );
    }
    if (value === true) {
      return (
        <Row className={"animate"}>
        <Col sm={6} md={4} lg={4} xs={12} />
        <Col sm={6} md={4} lg={4} xs={12} className={"auth-box"}>
          <h1 className={"h2"}>Reset password </h1>
        <>

          <div >
            
            <form className="password-form" onSubmit={this.updatePassword}>
              <FormGroup>
                <FormLabel>
                  <i class="fas fa-key left" />
                  Password <span className="required">*</span>
                </FormLabel>
                <FormControl
                  required="true"
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  value={password}
                  onChange={this.onInputChange}
                />
                {passwordError ? <p style={{ color: "red" }}>{passwordError}</p> : null}
              </FormGroup>
              <FormGroup>

                <FormLabel> <i className="fa fa-lock left"></i> Re-type password <span className="required">*</span> </FormLabel>
                <FormControl name="cpassword" type="password" value={cpassword} id="cpassword" onChange={this.onInputChange} placeholder={"********"} />
                {cpasswordError ? <p style={{ color: "red" }}>{cpasswordError}</p> : null}
              </FormGroup>

              <Button type="submit">Update Password</Button>
            </form>
          </div>
        </>
        </Col>
      </Row>
      );
    } else {
      return <p><h1>Your link has been expired.Please send another reset link.</h1></p>;
    }
  }
}

ResetPassword.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired
    })
  })
};
