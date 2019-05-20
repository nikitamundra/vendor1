import React, { Component } from 'react';
import { FormControl, Button, FormGroup, Row, Col, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

class ForgotPassword extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/product-list");
    }
  }
  
  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  sendEmail = async (e) => {
    e.preventDefault();
    const { email } = this.state;
    try{
    if (email === '') {
     
    } else {
      this.setState({
           isLoading: true
      })
    }
     const response = await axios.post("http://192.168.2.146:8080/forgotPassword", {email})
          console.log(response.data);
          if (response.data === "recovery email sent") {
            this.setState({
              isLoading: false
            });
            toast.success("Email Successfully Sent!")
          } 
       
      }  catch (error) {
        this.setState({ isLoading: false });
        toast.error(`${(error.response && error.response.data && error.response.data.message) || "Unknown error"}`);
     }
    };
  render() {
    const {
      email, isLoading , showError } = this.state;

    return (
      <Row className={"animate"}>

        <Col sm={6} md={4} lg={4} xs={12} />
        <Col sm={6} md={4} lg={4} xs={12} className={"auth-box"}  >
          <h1 className={"h2"}>Reset Password </h1>
          <div>
            <form onSubmit={this.sendEmail}>
              <FormGroup>
                <FormLabel> <i className="fa fa-envelope left"></i> Enter registered email  </FormLabel>
                <FormControl id="email" name="email" value={email} autoComplete="Email" onChange={this.handleChange('email')} placeholder={"example@gmail.com"} />

              </FormGroup>

              <Button
                type="submit"
                variant={"success"}
              >
                 {isLoading ? "please wait.." : "Send Confirmation"} 
            </Button>
            </form>

            {showError && (
              <div className = {"auth-box"}>
                <p>
                  That email address isn&apos;t recognized. Please try again or
                  register for a new account.
            </p>
                <Button
                  variant={"primary"}
                  onClick={() => {
                    this.props.history.push("/signup")
                  }}
                >
                  <i className="fas fa-sign-in-alt left"></i>  Sign Up</Button>
              </div>
            )}
            
            <Link to={"/home"} />
          </div>
        </Col>

      </Row>

    );
  }
}

export default ForgotPassword;