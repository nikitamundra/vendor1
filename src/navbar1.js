import React, {Component} from 'react';
import {NavLink } from 'react-router-dom';
import {  Navbar, Nav } from 'react-bootstrap';


class Navbar1 extends Component {

  render() {
    
  return (
    
    
        <Navbar bg="primary" variant="dark"  >
          <Navbar.Brand href="#home">Vendor</Navbar.Brand>
          <Nav className="ml-auto" variant="pills"   >
            <NavLink exact to={"/"}  className={"text-white nav-item nav"} > <i className="fa fa-home left"></i>Home</NavLink>

              {
              localStorage.getItem("token") ? <>
              <NavLink to={"/product-list"} className={"text-white nav-item nav"} activeClassName ={"active"}> <i className = "fa fa-list-alt left"></i>Products</NavLink>
              <NavLink to={"/profile"} className={"text-white nav-item nav"} activeClassName ={"active"}> <i className = "fas fa-user-circle left"></i>Profile</NavLink>
              <NavLink to={"/logout"} className={"text-white nav-item "} activeClassName ={"active"} > <i className = "fas fa-sign-out-alt left"></i>Logout</NavLink> 
              </> : <><NavLink to={"/login"} className={"text-white nav-item"} activeClassName ={"active"}> <i className="fas fa-user-plus left"></i>Login</NavLink>
              <NavLink to={"/signup"} className={"text-white nav-item"} activeClassName ={"active"}> <i className="fas fa-sign-in-alt left"></i>Signup</NavLink></>
            }   
            
          </Nav>
        </Navbar>
       
  )}
        }

        export default Navbar1;