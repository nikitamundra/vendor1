import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

class Logout extends Component {
    componentDidMount() {
        const token = localStorage.getItem("token");
        if (!token) {
          this.props.history.push("/login");
         toast.success("Logout successfully");
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