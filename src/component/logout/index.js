import React, { Component } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
class Logout extends Component {
    componentDidMount() {
        const token = localStorage.getItem("token");
        if (!token) {
          this.props.history.push("/login");
          Swal.fire(
            'Done!',
            'You are successfully loggedOut!',
            'success'
          )
        }
      }
render() {
return (  <div > className = {"animate"}

 <Link to={"/"} onClick={localStorage.clear()}>
 LOGOUT 
</Link> 
</div>
);
}
}
export default Logout;