import React, { Component } from "react";
import axios from "axios";
import Userprofile from './usertable';

class Profile extends Component {
    
    constructor(props){
        super(props);
        this.state ={ product : [] , cId: localStorage.getItem("cId")};
        }
     
       componentDidMount = async () =>  {
         
           const token = localStorage.getItem("token");
           if (!token) {
             this.props.history.push("/login");
           }
           const {cId} = this.state;
           const data = {cId} 
           const res = await axios.post('http://192.168.2.146:8080/userdata',data)
               const result = res.data.result;
                 this.setState({ product: result });
                 if (!result) {
                 console.log("error");
                 }
                 };
    render() {
        const {product }= this.state;
        return (
            <>
           
            <Userprofile  obj={product} key={product._id} />;
            
            </>
        );
    }
}
export default Profile;