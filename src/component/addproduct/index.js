import React, { Component } from "react";
import axios from "axios";
import { FormGroup, Col, Button,Row, FormControl, FormLabel } from "react-bootstrap";
import Validator, { ValidationTypes } from "js-object-validation";
import { toast } from "react-toastify";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdesc: "",
      ptitle: "",
      pprice: "",
      psprice: "",
      file: "",
      cId:localStorage.getItem("cId"),
      errors: {}
    };
  }
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    }
  }
 

  onSubmit = async e => {
    e.preventDefault();
    try {
      const {
        pdesc,
        ptitle,
        pprice,
        psprice,
        file,
        cId
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
        file: {
          [ValidationTypes.REQUIRED]: true
        }
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
        file: {
          [ValidationTypes.REQUIRED]: "Please insert the image of product."
        }
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
        ptitle,
        pdesc,
        pprice,
        psprice,
        file,
        cId
      };
      const body = new FormData();
      for (const i in data) {
        if (data.hasOwnProperty(i)) {
          const element = data[i];
          body.append(i, element);
        }
      }

      
      const token = localStorage.getItem("token");
      // eslint-disable-next-line
      const response = await axios.post("http://192.168.2.146:8080/addProduct", body, {
        headers: { Authorization: `Bearer ${token}` }
      });  
    
      this.props.history.push("/product-list");
      toast.success("Product added successsfully!");
    } 
    catch (error) {
      console.log(error);
      toast.error(`${(error.response && error.response.data && error.response.data.message[0].msg) || "Unknown error!! Login again"}`);
    }
  };
  
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
    onProduct_image = (e) => {
        console.log(e)
        this.setState({
            file: e.target.files[0] ? e.target.files[0] : null,
        })
    }


    render() {

        const { ptitle, isLoading ,pdesc ,pprice, psprice, errors} = this.state;
        const { ptitle: ptitleError ,
         pdesc: pdescError,
          pprice: ppriceError,
          psprice: pspriceError,
        file : fileError }= errors
      
        return (
            <Row className= {"animate"}>
                <Col sm={6} md={4} lg={4} xs={12} />
                <Col sm={6} md={4} lg={4} xs={12}  className= {"auth-box1"}>
                    <h1> Add Product items </h1>

                    <form onSubmit={this.onSubmit}>
                        <FormGroup>
                          <FormLabel>  Product title <span className="required">*</span></FormLabel>
                            <FormControl id="ptitle" name="ptitle" type="text" value={ptitle} onChange={this.onInputChange} placeholder={" title"} />
                            {ptitleError ? <p style={{ color: "red" }}>{ptitleError}</p> : null}
                        </FormGroup>

                        <FormGroup>
                        <FormLabel>Product description <span className="required">*</span></FormLabel>
                            <FormControl id="pdesc" name="pdesc" type="text area" value={pdesc} onChange={this.onInputChange} placeholder={" Description"} />
                            {pdescError ? <p style={{ color: "red" }}>{pdescError}</p> : null}
                        </FormGroup>

                        <FormGroup>
                        <FormLabel>Product price <span className="required">*</span></FormLabel>
                            <FormControl id="pprice" name="pprice" type="number" value={pprice} onChange={this.onInputChange} placeholder={" Price"} />
                            {ppriceError ? <p style={{ color: "red" }}>{ppriceError}</p> : null}
                        </FormGroup>

                        <FormGroup>
                        <FormLabel>Product selling price <span className="required">*</span></FormLabel>
                            <FormControl id="psprice" name="psprice" type="number" value={psprice} onChange={this.onInputChange} placeholder={" Selling price"} />
                            {pspriceError ? <p style={{ color: "red" }}>{pspriceError}</p> : null}
                        </FormGroup>

                        <FormGroup>
                        <FormLabel> Product image <span className="required">*</span></FormLabel>
                            <FormControl id="file" name="file" type="file"  onChange={this.onProduct_image} />
                            {fileError ? <p style={{ color: "red" }}>{fileError}</p> : null}
                        </FormGroup>
                        <Button
                            type="submit"
                            variant={"success"}
                        >
                            {isLoading ? "please wait.." : "Add Product"}
                        </Button>
                    </form>
                </Col>
            </Row>

        )
    }
};
export default List;