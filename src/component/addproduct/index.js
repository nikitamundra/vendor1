import React, { Component } from "react";
import axios from "axios";
import { FormGroup, Col, Button,Row, FormControl, FormLabel } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Validator, { ValidationTypes } from "js-object-validation";
import { toast } from "react-toastify";
const BASE_URL = 'http://192.168.2.146:8080/';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdesc: "",
      ptitle: "",
      pprice: "",
      psprice: "",
      file: "",
      category: "",
      cId:localStorage.getItem("cId"),
      errors: {}
    };
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
          this.setState({ category: result.category });
          if (!result) {
          console.log("error");
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

        const { ptitle, isLoading ,pdesc ,pprice,category,  psprice, errors} = this.state;
        const { ptitle: ptitleError ,
         pdesc: pdescError,
          pprice: ppriceError,
          psprice: pspriceError,
        file : fileError }= errors

        let { imagePreviewUrl } = this.state;
    let $imagePreview = (
      <img src={BASE_URL + this.state.file} alt="No Img selected" width="150px" height="150px" />
    );
    if (imagePreviewUrl) {
      $imagePreview = (
        <img src={imagePreviewUrl} alt="No Img selected" width="150px" height="150px" />
      );
    }
      
        return (
            <Row className= {"animate"}>
                <Col sm={6} md={4} lg={4} xs={12} />
                <Col sm={6} md={4} lg={4} xs={12}  className= {"auth-box"}>
                    <h1> Add Product items </h1>
                    <FormGroup>
                          <FormLabel><i className="fa fa-list-alt left" ></i> Category</FormLabel>
                          <FormControl name="category" readOnly type="text" value={category}  />
                        </FormGroup>


                    <form onSubmit={this.onSubmit}>
                        <FormGroup>
                          <FormLabel> <i className="fas fa-pen left"></i> Product title <span className="required">*</span></FormLabel>
                            <FormControl id="ptitle" name="ptitle" type="text" value={ptitle} onChange={this.onInputChange} placeholder={" title"} />
                            {ptitleError ? <p style={{ color: "red" }}>{ptitleError}</p> : null}
                        </FormGroup>

                        <FormGroup>
                        <FormLabel><i className="fas fa-info-circle left"></i> Product description <span className="required">*</span></FormLabel>
                            <FormControl id="pdesc" name="pdesc" type="text area" value={pdesc} onChange={this.onInputChange} placeholder={" Description"} />
                            {pdescError ? <p style={{ color: "red" }}>{pdescError}</p> : null}
                        </FormGroup>

                        <FormGroup>
                        <FormLabel> <i className="fas fa-tag left"></i>Product price <span className="required">*</span></FormLabel>
                            <FormControl id="pprice" name="pprice" type="number" value={pprice} onChange={this.onInputChange} placeholder={" Price"} />
                            {ppriceError ? <p style={{ color: "red" }}>{ppriceError}</p> : null}
                        </FormGroup>

                        <FormGroup>
                        <FormLabel> <i className="fas fa-tag left"></i>Product selling price <span className="required">*</span></FormLabel>
                            <FormControl id="psprice" name="psprice" type="number" value={psprice} onChange={this.onInputChange} placeholder={" Selling price"} />
                            {pspriceError ? <p style={{ color: "red" }}>{pspriceError}</p> : null}
                        </FormGroup>

                       
                        <FormGroup>
                        <FormLabel> <i className="fas fa-image left"></i> Product image <span className="required">*</span></FormLabel>
                            <FormControl id="file" name="file" type="file"  onChange={this.onChangefile} />
                            {fileError ? <p style={{ color: "red" }}>{fileError}</p> : null}
                        </FormGroup>
                        <FormGroup align="center">
              <div className="imgPreview">{$imagePreview}</div>
            </FormGroup> 
                        <Button
                            type="submit"
                            variant={"success"}
                        > <i className="	fa fa-plus left left"></i>
                            {isLoading ? "please wait.." : "Add Product"}
                        </Button>
                        &nbsp; &nbsp;
                        <Button 
                            type="submit"
                            variant="success"
                        >
                           <Link  className = { "bcol " } to={"/product-list" } >  <i className="	fa fa-arrow-circle-left bcol left"></i> Cancel</Link>
                        </Button>
                    </form>
                </Col>
            </Row>

        )
    }
};
export default List;