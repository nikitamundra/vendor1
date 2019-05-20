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
import { Link } from 'react-router-dom';
import Validator, { ValidationTypes } from "js-object-validation";
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
      errors: {},
      imageUpdated: false
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
    try {
      const {
        pdesc,
        ptitle,
        pprice,
        psprice,
      } = this.state;

      const obj = {
        pdesc,
        ptitle,
        pprice,
        psprice
      };
      const validations = {
        pdesc: {
          [ValidationTypes.REQUIRED]: true
        },
        ptitle: {
          [ValidationTypes.REQUIRED]: true
        },
        pprice: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.NUMERIC]: true
        },
        psprice: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.NUMERIC]: true
        },

      };
      const messages = {
        pdesc: {
          [ValidationTypes.REQUIRED]:
            "Please Give the description about the product."
        },
        ptitle: {
          [ValidationTypes.REQUIRED]: "Please Give the Title of product."
        },
        pprice: {
          [ValidationTypes.REQUIRED]: "Please Enter the price of product.",
          [ValidationTypes.NUMERIC]: "Must be a digit."
        },
        psprice: {
          [ValidationTypes.REQUIRED]:
            "Please Enter the Selling price of product.",
          [ValidationTypes.NUMERIC]: "Must be a digit."
        },
      };
      const { isValid, errors } = Validator(obj, validations, messages);
      console.log(errors);
      console.log(isValid);
      if (!isValid) {
        this.setState({
          errors
        });
        return;
      }
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
    } catch (error) {
      console.log(error);
    }
  }
  onInputChange = e => {
    const { target } = e;
    const { value, name } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };
 
  onChangefile = e => {
    let reader = new FileReader();
    let file = e.target.files[0];
    this.setState({
      file: e.target.files[0] ? e.target.files[0] : null,
      imageUpdated: true
    });
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  render() {


    const { ptitle, pdesc, pprice, psprice, errors } = this.state;
    const { ptitle: ptitleError,
      pdesc: pdescError,
      pprice: ppriceError,
      psprice: pspriceError,
    } = errors

    let { imagePreviewUrl } = this.state;
    let $imagePreview = (
      <img src={BASE_URL + this.state.file} alt="logo" width="150px" height="150px" />
    );
    if (imagePreviewUrl) {
      $imagePreview = (
        <img src={imagePreviewUrl} alt="logo" width="150px" height="150px" />
      );
    }
    return (
      <Row className={"animate"}>

        <Col sm={6} md={4} lg={4} xs={12} />
        <Col sm={6} md={4} lg={4} xs={12} className={"auth-box"}>
          <h1> Update Products </h1>

          <form onSubmit={this.onSubmit}>
            <FormGroup>
              <FormLabel> <i className="fas fa-pen left"></i> Product title</FormLabel>
              <FormControl id="ptitle" name="ptitle" type="text" value={ptitle} onChange={this.onInputChange} placeholder={"Product title"} />
              {ptitleError ? <p style={{ color: "red" }}>{ptitleError}</p> : null}
            </FormGroup>

            <FormGroup>
              <FormLabel><i className="fas fa-info-circle left"></i> Product description</FormLabel>
              <FormControl id="pdesc" name="pdesc" type="text area" value={pdesc} onChange={this.onInputChange} placeholder={"Product Description"} />
              {pdescError ? <p style={{ color: "red" }}>{pdescError}</p> : null}
            </FormGroup>

            <FormGroup>
              <FormLabel>  <i className="fas fa-tag left"></i>Product price</FormLabel>
              <FormControl id="pprice" name="pprice" type="number" value={pprice} onChange={this.onInputChange} placeholder={"Product Price"} />
              {ppriceError ? <p style={{ color: "red" }}>{ppriceError}</p> : null}
            </FormGroup>

            <FormGroup>
              <FormLabel>  <i className="fas fa-tag left"></i>Product selling price</FormLabel>
              <FormControl id="psprice" name="psprice" type="number" value={psprice} onChange={this.onInputChange} placeholder={"Product selling price"} />
              {pspriceError ? <p style={{ color: "red" }}>{pspriceError}</p> : null}
            </FormGroup>

            <FormGroup>
              <FormLabel><i className="fas fa-image left"></i> Product image</FormLabel>
              <FormControl id="file" name="file" type="file" onChange={this.onChangefile} />
            </FormGroup>
            <FormGroup align="center">
              <div className="imgPreview">{$imagePreview}</div>
            </FormGroup>

            <Button
              type="submit"
              variant={"success"}
            >
              <i className="far fa-edit left"></i>
              Update Product

            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button
              type="submit"
              variant="success"
            >
              <Link className={"bcol "} to={"/product-list"} >  <i className="	fa fa-arrow-circle-left bcol left"></i> Cancel</Link>
            </Button>
          </form>
        </Col>

      </Row>

    )
  }
};
export default Edit;