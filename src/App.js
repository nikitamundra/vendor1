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
import ForgotPassword from './component/login/forgotpassword';
import  ResetPassword from './component/login/resetpassword';
import { Container } from 'react-bootstrap';
import Navbar1 from './navbar1';


class App extends Component {

  render() {
    const DefaultLayout = ({ component: Component, ...rest }) => {
      console.log("djfgfgudfyds");
      return (
      <Route
      {...rest}
      render={props => (
      <>
      <Navbar1 {...props} />
      <Component {...props} />
      </>
      )}
      />
      );
      };
  return (
    <Router>
      <>
       
        <Container fluid>

          <Switch>
            <DefaultLayout exact path="/" component={Home} />
            <DefaultLayout path="/login" component={Login} />
            <DefaultLayout path="/signup" component={Signup} />
            <DefaultLayout path="/add-product" component={Addproduct} />
            <DefaultLayout path="/product-list" component={List} />
            <DefaultLayout path="/update/:_id" component={Edit} />
            <DefaultLayout path="/logout" component={Logout} />
            <DefaultLayout path="/profile" component={Profile} />
           <DefaultLayout path="/forgot-password" component={ForgotPassword} />
           <DefaultLayout path="/reset/:token" component={ResetPassword} />
          </Switch>

        </Container>
      </>
    </Router>
  );
}
}

export default App;

