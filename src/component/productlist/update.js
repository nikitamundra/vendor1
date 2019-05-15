import React, { Component } from "react";
import axios from "axios";
import {
  FormGroup,
  Button,
  Row,
  Col,
  FormControl,
  FormLabel,

} from "react-bootstrap";
const BASE_URL = 'http://192.168.2.146:8080/';


class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ptitle: "",
      pdesc: "",
      pprice: "",
      psprice: "",
      file: "",
      imageUpdated : false
    };
  }
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    }
  }
 
  componentDidMount = async () => {
    console.log(this.props.match.params._id)
    try {
      const response = await axios.get(
        "http://192.168.2.146:8080/productdata/" + this.props.match.params._id
      );
      console.log(response);

      this.setState({

        ptitle: response.data.result.ptitle,
        pdesc: response.data.result.pdesc,
        pprice: response.data.result.pprice,
        psprice: response.data.result.psprice,
        file: response.data.result.file
      });
    } catch (error) {
      console.log(error);

    }
  };

  onSubmit = async e => {
    e.preventDefault();
    const data = {

      ptitle: this.state.ptitle,
      pdesc: this.state.pdesc,
      pprice: this.state.pprice,
      psprice: this.state.psprice,
      file: this.state.file,
      imageUpdated: this.state.imageUpdated
    };
    const body = new FormData();
    for (const i in data) {
      if (data.hasOwnProperty(i)) {
        const element = data[i];
        body.append(i, element);
      }
    }

    const result = await axios.put("http://192.168.2.146:8080/update/" + this.props.match.params._id, body);
    console.log(result);
    this.props.history.push("/product-list")
  };

  onInputChange = e => {
    const { target } = e;
    const { value, name } = target;
    this.setState({
      [name]: value
    });
  };
  onProduct_image = (e) => {
    console.log(e)
    this.setState({
      file: e.target.files[0] ? e.target.files[0] : null,
      imageUpdated: true
    });
  };


  render() {

    const { ptitle, pdesc, pprice, psprice } = this.state;

    return (
      <Row className={"animate"}>

        <Col sm={6} md={4} lg={4} xs={12} />
        <Col sm={6} md={4} lg={4} xs={12} className={"auth-box"}>
          <h1> Update Products </h1>

          <form onSubmit={this.onSubmit}>
            <FormGroup>
              <FormLabel> Product title</FormLabel>
              <FormControl id="ptitle" name="ptitle" type="text" value={ptitle} onChange={this.onInputChange} placeholder={"Product title"} />
            </FormGroup>

            <FormGroup>
              <FormLabel>Product description</FormLabel>
              <FormControl id="pdesc" name="pdesc" type="text area" value={pdesc} onChange={this.onInputChange} placeholder={"Product Description"} />
            </FormGroup>

            <FormGroup>
              <FormLabel>Product price</FormLabel>
              <FormControl id="pprice" name="pprice" type="number" value={pprice} onChange={this.onInputChange} placeholder={"Product Price"} />
            </FormGroup>

            <FormGroup>
              <FormLabel>Product selling price</FormLabel>
              <FormControl id="psprice" name="psprice" type="number" value={psprice} onChange={this.onInputChange} placeholder={"Product selling price"} />
            </FormGroup>

            <FormGroup>
              <FormLabel>Product image</FormLabel>
              <FormControl id="file" name="file" type="file" onChange={this.onProduct_image} />
            </FormGroup>
            <FormGroup align = "center">
            <img src={BASE_URL + this.state.file} alt={"Logo"} width="150px" height="150px" ></img>
            </FormGroup>
               
            <Button 
              type="submit"
              variant={"success"}
            >  
             <i className="far fa-edit left"></i>
              Update Product

            </Button>
          </form>
        </Col>

      </Row>

    );
  }
};
export default Edit;