import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import './App.css';
import Home from './component/home';
import Login from './component/login';
import Signup from './component/signup';
import Addproduct from './component/addproduct';
import List from './component/productlist';
import Edit from './component/productlist/update';
import Logout from './component/logout';
import Profile from './component/profile';
import { Container, Navbar, Nav } from 'react-bootstrap';
import {NavLink } from 'react-router-dom';


class App extends Component {

  render() {
  return (
    <Router>
      <>
        <Navbar bg="primary" variant="dark"  >
          <Navbar.Brand href="#home">Vendor</Navbar.Brand>
          <Nav className="ml-auto" variant="pills"   >
            <NavLink exact to={"/"}  className={"text-white nav-item "} >Home</NavLink>

              {
              localStorage.getItem("token") ? <>
              <NavLink to={"/product-list"} className={"text-white nav-item"} activeClassName ={"active"}>Product List</NavLink>
              <NavLink to={"/logout"} className={"text-white nav-item"} activeClassName ={"active"} >Logout</NavLink> 
              <NavLink to={"/profile"} className={"text-white nav-item"} activeClassName ={"active"}>Profile</NavLink>
              </> : <><NavLink to={"/login"} className={"text-white nav-item"} activeClassName ={"active"}>Login</NavLink>
              <NavLink to={"/signup"} className={"text-white nav-item"} activeClassName ={"active"}>Signup</NavLink></>
            }   
            
          </Nav>
        </Navbar>
        <Container fluid>

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/add-product" component={Addproduct} />
            <Route path="/product-list" component={List} />
            <Route path="/update/:_id" component={Edit} />
            <Route path="/logout" component={Logout} />
            <Route path="/profile" component={Profile} />
           
          </Switch>

        </Container>
      </>
    </Router>
  );
}
}

export default App;

