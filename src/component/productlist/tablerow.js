import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2'
import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';
const BASE_URL = 'http://192.168.2.146:8080/';
class TableRow extends Component {
    constructor(props){
      super (props);
      this.state= {

             Isopen: false
      }
    }

  onSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.delete("http://192.168.2.146:8080/delete/" + this.props.obj._id)
      console.log(response);
      
    
    }catch(error) {
          
      console.log(error);
      toast.error(`${(error.response && error.response.data && error.response.data.message) || "Unknown error"}`);
    }
  }
      
  
  render() {
    return (

      <tr className={"animate"}>
        <td>{}</td>
        <td>{this.props.obj.ptitle} </td>
        <td>{this.props.obj.pdesc} </td>
        <td>{this.props.obj.pprice.toFixed(2)}</td>
        <td>{this.props.obj.psprice.toFixed(2)}</td>
        <td> <img src={BASE_URL + this.props.obj.file} alt={"Logo"} width="150px" height="150px" ></img></td>
        <td>

          <Button
            className={"a "}
            type="submit"
            variant={"warning"}

          >
            <Link to={"/update/" + this.props.obj._id} >  <i className="fas fa-edit left"></i> Edit</Link>
          </Button>
        </td>
        <td>

          <Button
            type="submit"
            variant={"danger"}
            onClick={e =>
              Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.value) {
                  Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  )
                    &&
                    this.props.onDelete(this.props.obj._id)
                }
              })
            }
          >
           <i className="fa fa-trash left"></i> Delete
            </Button>

        </td>
      </tr>
    );
  }
}
export default TableRow;
