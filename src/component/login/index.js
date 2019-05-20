import React, { Component } from "react";
import Axios from "axios";
import { FormControl, Button, FormGroup, Row, Col, FormLabel } from 'react-bootstrap';
import Validator, { ValidationTypes } from "js-object-validation";
import { toast } from 'react-toastify';

import { Link } from 'react-router-dom';
import './index.css';

class Login extends Component {
   constructor(props) {
      super(props);
      this.state = {
         email: "",
         password: "",
         isLoading: false,
         errors: {}
      };
   }
   componentDidMount() {
      const token = localStorage.getItem("token");
      if (token) {
         this.props.history.push("/add-product");
      }
   }
   onLogin = async (e) => {
      e.preventDefault();
      this.setState({
         isLoading: true,
         errors: {}
      });

      try {
         const { email, password } = this.state;
         const obj = { email, password };
         const validations = {
            email: {
               [ValidationTypes.REQUIRED]: true,
               [ValidationTypes.EMAIL]: true,
            },
            password: {
               [ValidationTypes.REQUIRED]: true,
            }
         }

         const { isValid, errors } = Validator(obj, validations);
         if (!isValid) {
            console.log(errors)

            this.setState({
               errors,
               isloading: false
            });
            return;
         }

         const response = await Axios.post('http://192.168.2.146:8080/login', obj)
         localStorage.setItem("token", response.data.token);
         localStorage.setItem("cId", response.data.result._id);
         console.log(this.props);
        
         toast.success("Login Successfully")
         this.props.history.push("/product-list")
      }

      catch (error) {

         this.setState({ isLoading: false });
         toast.error(`${(error.response && error.response.data && error.response.data.message) || "Unknown error"}`);
      }
   };
   onInputChange = e => {
      const { target } = e;
      const { value, name } = target;
      this.setState({
         [name]: value,
         errors: {
            ...this.state.errors,
            [name]: null
         }
      });
   };


   render() {
      const { email, password, isLoading, errors } = this.state;
      const { email: emailError, password: passwordError } = errors;
      console.log(errors);
      return (
         <Row className={"animate"}>

            <Col sm={6} md={4} lg={4} xs={12} />
            <Col sm={6} md={4} lg={4} xs={12} className={"auth-box"}  >
               <h2 className={"h2"}>Log In  </h2>
               <form onSubmit={ this.onLogin} >
                  <FormGroup>
                     <FormLabel> <i className = "fa fa-envelope left"></i> Enter email <span className="required">*</span> </FormLabel>
                     <FormControl id="email" name="email" value={email} autoComplete="Email" onChange={this.onInputChange} placeholder={"Email"} />
                     {emailError ? <p style={{ color: "red" }}>{emailError}</p> : null}
                  </FormGroup>
                  <FormGroup>
                     <FormLabel><i className = "fa fa-key left"></i> Enter password <span className="required">*</span> </FormLabel>
                     <FormControl name="password" type="password" value={password} id="password" autoComplete="current-Password" onChange={this.onInputChange} placeholder={"Password"} />
                     {passwordError ? <p style={{ color: "red" }}>{passwordError}</p> : null}
                  </FormGroup>
                  <Link  to ="/forgot-password"><p>Forgot password ?</p></Link>
                  <Link  to ="/signup"><p>Not registered yet!! Click here</p></Link>
                  <Button
                     type="submit"
                     variant={"success"}
                     
                  > <i className="fas fa-sign-in-alt left"></i>
                     {isLoading ? "Please wait.." : "Sign In"}
                     
                  </Button>
                 
                
               </form>
            </Col>

         </Row>
      )
   }
};

export default Login;