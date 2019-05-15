
import React, { Component, Fragment } from 'react';
import axios from "axios";
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableRow from './tablerow';
import { MDBBtn, toast, MDBIcon } from 'mdbreact';


class List extends Component {
  constructor(props) {
    super(props);
    this.state = { product: [], cId: localStorage.getItem("cId") };
  }

  componentDidMount = async () => {

    const token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    }
    this.getData();
  };
  getData = async () => {
    const { cId } = this.state;
    const data = { cId }
    const res = await axios.post('http://192.168.2.146:8080/showproduct', data)
    const result = res.data.result;
    this.setState({ product: result });
    if (!result) {
      console.log("error");
    }
  };

  onDelete = async productId => {
    const response = await axios.delete("http://192.168.2.146:8080/delete/" + productId);
    console.log(response);
    toast("Product Deleted");
    this.getData();
  }
  render() {
    const { product } = this.state;

    return (
      <>
        {product.length ? (
          <>
            <h1 className={"h2"}>Product List </h1>
            <div>
            <Link to={"/add-product"}>
              <Fragment>
                <MDBBtn color="info" style={{ float: "right" }} >
                 <i className="fa fa-plus left"></i> 
                Add Product
</MDBBtn> <br />
              </Fragment>
            </Link>
            </div>
            <Table striped bordered hover className={"css-serial"} >
              <thead >
                <tr>
                  <th>Sr.no. </th>
                  <th>Product title</th>
                  <th>Product description</th>
                  <th>Product price</th>
                  <th>Product selling price</th>
                  <th>Product image</th>
                  <th colSpan="2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {product && product.length ? product.map(product => {
                  return <TableRow obj={product} key={product._id} onDelete={this.onDelete} />;
                }) : null}
              </tbody>
            </Table>
          </>
        ) : (
            <>
              <h1 className={"h2"}>Product List </h1>
              <Link to={"/add-product"}>
                <Fragment>
                  <MDBBtn color="info" style={{ float: "right" }} >
                    Add Product
</MDBBtn> <br />
                </Fragment>
              </Link>
              <Table striped bordered hover className={"css-serial"} >
                <thead >
                  <tr>
                    <th>S No. </th>
                    <th>Product title</th>
                    <th>Product description</th>
                    <th>Product price</th>
                    <th>Product selling price</th>
                    <th>Product image</th>
                    <th colSpan="2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {product && product.length ? product.map(product => {
                    return <TableRow obj={product} key={product._id} onDelete={this.onDelete} />;
                  }) : null}
                </tbody>
              </Table>
              <MDBIcon icon =  "ban" className = {"icons"}/>
              <p align="center"> Currently there are no product items  added. <br />
                Please click below button to add new.</p>
                <Button
               className = {"flex-center"}
              variant={"primary"}
              value={"Go to home"}
              onClick={() => {
                this.props.history.push("/add-product")
              }}
            >
             <i className="fa fa-plus left"></i> Add New </Button>
              
            </>
          )
        }
      </>
    )
  }
}
export default List;