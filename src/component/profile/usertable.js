import React, { Component } from "react";
import { FormControl, FormGroup, Row, Col, FormLabel } from 'react-bootstrap';
const BASE_URL = 'http://192.168.2.146:8080/';


class Userprofile extends Component {
    render() {
        return (

            <Row className={"animate"}>
                <Col sm={6} md={4} lg={4} xs={12} />
                <Col sm={6} md={4} lg={4} xs={12} className={"auth-box1"}>
                   <h1 className={"h2"}>Profile </h1>
                    <form >


                        <FormGroup>
                            <FormLabel> <i className = "fa fa-user left"></i> Username</FormLabel>
                            <FormControl readOnly value={this.props.obj.username} />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel><i className = "fa fa-envelope left"></i> Email</FormLabel>
                            <FormControl readOnly value={this.props.obj.email} />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel><i className = "fa fa-phone-square left"></i> Mobile no.</FormLabel>
                            <FormControl readOnly value={this.props.obj.mobile} />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel> <i className = "fas fa-female left"></i>Gender</FormLabel>
                            <FormControl readOnly value={this.props.obj.gender} />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel><i className = "fa fa-list-alt left"></i> Category</FormLabel>
                            <FormControl readOnly value={this.props.obj.category} />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel><i className = "fa fa-id-card left"></i> Id proof</FormLabel>
                            <FormControl readOnly value={this.props.obj.idproof} />
                        </FormGroup>
                        <FormGroup align="center" >
                            <img src={BASE_URL + this.props.obj.file} width="150px" height="150px" className={"ig"} alt="logo"></img>
                        </FormGroup>
                    </form>
                </Col>
            </Row>
        );
    }
}
export default Userprofile;