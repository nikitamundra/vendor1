import React, { Component } from "react";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';
import { FormControl, Button, FormGroup, Row, Col, Tooltip, OverlayTrigger, FormLabel, FormCheck } from 'react-bootstrap';
import Validator, { ValidationTypes } from "js-object-validation";
import { toast } from 'react-toastify';
import "./index.css";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      cpassword: "",
      mobile: "",
      gender: "",
      region: "",
      category: "this.state.value",
      option: "",
      a: "",
      b: "",
      categoryData: [],
      idproof: "",
      file: "",
      errors: {},
      isLoading: false,
      country: [
        { name: 'India', region: 'Asia' },
        { name: 'United States', region: 'Northern America' },
        { name: 'Russia', region: 'Europe' }
      ],
      selectedCountry: 'India'
    };
  }
  componentDidMount = async () => {

    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/product-list");
    }
    try {
      Axios.get('http://192.168.2.146:8080/category')
        .then(res => {
          const result = res.data;
          const option = []
          if (result.result1 && result.result1.length) {
            console.log('in if')
            // eslint-disable-next-line
            result.result1.map(Category => {
              option.push({
                value: Category._cid,
                label: Category.category

              })
            })
          }
          console.log(option);
          this.setState({ option, categoryData: result.result1 });
        })
      const x = await Axios.post('http://192.168.2.146:8080/countmale');
      const malep = x.data.result

      const y = await Axios.post('http://192.168.2.146:8080/countfemale');
      const femalep = y.data.result;
      const z = parseInt(malep + femalep);
      const p = malep / z;
      const q = femalep / z;
      const a = p * 100;
      const b = q * 100;
      this.setState({ data: a })
      this.setState({ data1: b })

    }
    catch (error) {
      console.log(error)
    }
  }

  onLogin = async (e) => {
    e.preventDefault();
    this.setState({
      isLoading: true,
      errors: {}
    })
    try {
      const { username, email, password, cpassword, mobile, category, gender, idproof, file } = this.state;
      const obj = { username, email, password, cpassword, mobile, gender, category, idproof }
      const validations = {
        username: {
          [ValidationTypes.REQUIRED]: true
        },
        email: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.EMAIL]: true
        },
        password: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.PASSWORD]: true,
          [ValidationTypes.MINLENGTH]: 8,
        },
        cpassword: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.EQUAL]: "password"
        },
        mobile: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.NUMERIC]: true,
          [ValidationTypes.MINLENGTH]: 7,
          [ValidationTypes.MAXLENGTH]: 14
        },
        gender: {
          [ValidationTypes.REQUIRED]: true
        },
        category: {
          [ValidationTypes.REQUIRED]: true
        },
        idproof: {
          [ValidationTypes.REQUIRED]: true
        },
        file: {
          [ValidationTypes.REQUIRED]: true
        }
      };
      const messages = {
        username: {
          [ValidationTypes.REQUIRED]: "Please enter username."
        },
        email: {
          [ValidationTypes.REQUIRED]: "Please enter email.",
          [ValidationTypes.EMAIL]: "Please enter valid email."
        },
        password: {
          [ValidationTypes.REQUIRED]: "Please enter password.",
          [ValidationTypes.MINLENGTH]: "Please enter at least 8 characters.",
        },
        cpassword: {
          [ValidationTypes.REQUIRED]: "Please enter confirm password.",
          [ValidationTypes.EQUAL]: "Password and confirm password didn't match"
        },
        mobile: {
          [ValidationTypes.REQUIRED]: "Please enter mobile no.",
          [ValidationTypes.NUMERIC]: "Please enter in number",
          [ValidationTypes.MINLENGTH]: "Please enter atleast 7 digits",
          [ValidationTypes.MAXLENGTH]: "Please enter upto 14 digits"
        },
        gender: {
          [ValidationTypes.REQUIRED]: "Please select gender"
        },
        category: {
          [ValidationTypes.REQUIRED]: "Please select category"
        },
        idproof: {
          [ValidationTypes.REQUIRED]: "Please select idproof"
        },
        file: {
          [ValidationTypes.REQUIRED]: "Please insert image"
        }
      };
      const { isValid, errors } = Validator(obj, validations, messages);
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }
      const data = { username, email, password, cpassword, mobile, gender, category, idproof, file };
      const body = new FormData();
      for (const i in data) {
        if (data.hasOwnProperty(i)) {
          const element = data[i];
          body.append(i, element)
        }
      }
      // eslint-disable-next-line
      const response = await Axios.post('http://192.168.2.146:8080/addUser', body);
      console.log(response)
      this.setState({ username: "", email: "", password: "", cpassword: "", mobile: "", gender: "", category: "", idproof: "", file: "", isLoading: false });
      this.props.history.push("/login")
      toast.success("Data submitted success");



    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false });
      toast.error(`${(error.response && error.response.data && error.response.data.message[0].msg) || "Unknown error"}`);
      this.props.history.push("/signup")

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

  onfileChange = (e) => {
    this.setState({
      file: e.target.files[0] ? e.target.files[0] : null,
    })
  }
  handleChange = (e) => {
    console.log(this.state)

    let autocountry = this.state.country.filter(country => {
      return country.name === e.target.value
    })

    console.log(autocountry)
    this.setState({ selectedCountry: e.target.value, region: autocountry && autocountry.length ? autocountry[0].region : null })
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
    const { username,
      email,
      password,
      cpassword,
      mobile,
      // eslint-disable-next-line
      category,
      categoryData,
      idproof,
      isLoading,
      errors } = this.state;

    const { username: usernameError,
      email: emailError,
      password: passwordError,
      cpassword: cpasswordError,
      mobile: mobileError,
      gender: genderError,
      category: categoryError,
      idproof: idproofError,
      file: fileError,
    } = errors;

    let { imagePreviewUrl } = this.state;
    let $imagePreview = (
      <img src={this.state.file} alt="No img selected" width="150px" height="150px" />
    );
    if (imagePreviewUrl) {
      $imagePreview = (
        <img src={imagePreviewUrl} alt="No img selected" width="150px" height="150px" />
      );
    }

    return (


      <Row className={"animate"}>
        <Col sm={6} md={4} lg={4} xs={12} />
        <Col sm={6} md={4} lg={4} xs={12} className={"auth-box"}>
          <h1 className={"h2"}>Sign Up </h1>
          <form onSubmit={this.onLogin} noValidate>
            <Row  >
              <Col>
                <FormGroup >
                  <FormLabel> <i className="fa fa-user left"></i>Enter username  <span className="required">*</span> </FormLabel>
                  <FormControl id="username" name="username" placeholder={"username"} value={username} autoComplete="username" onChange={this.onInputChange} className={"c"} />
                  {usernameError ? <p style={{ color: "red" }}>{usernameError}</p> : null}
                </FormGroup>
              </Col>
              <Col  >
                <FormGroup>

                  <FormLabel> <i className="fa fa-envelope left"></i> Enter email  <span className="required">*</span> </FormLabel>
                  <FormControl id="email" name="email" type="email" value={email} onChange={this.onInputChange} placeholder={"example@gmail.com"} />
                  {emailError ? <p style={{ color: "red" }}>{emailError}</p> : null}

                </FormGroup>
              </Col>
            </Row>

            <Row  >
              <Col>
                <FormGroup>
                  <FormLabel> <i className="fa fa-key left"></i> Enter password <span className="required">*</span> </FormLabel>
                  <FormControl name="password" type="password" value={password} id="password" onChange={this.onInputChange} placeholder={"********"} />
                  {passwordError ? <p style={{ color: "red" }}>{passwordError}</p> : null}
                </FormGroup>
              </Col>
              <Col  >
                <FormGroup>
                  <FormLabel> <i className="fa fa-lock left"></i> Re-type password <span className="required">*</span> </FormLabel>
                  <FormControl name="cpassword" type="password" value={cpassword} id="cpassword" onChange={this.onInputChange} placeholder={"********"} />
                  {cpasswordError ? <p style={{ color: "red" }}>{cpasswordError}</p> : null}
                </FormGroup>
              </Col>
            </Row>

            <Row  >
              <Col>
                <FormGroup>
                  <FormLabel><i className="fa fa-phone-square left"></i> Enter Mobile no. <span className="required">*</span> </FormLabel>
                  <FormControl name="mobile" type="number" value={mobile} id="mobile" onChange={this.onInputChange} placeholder={"+91 0000000000"} />
                  {mobileError ? <p style={{ color: "red" }}>{mobileError}</p> : null}
                </FormGroup>
              </Col>
              <Col  >

                <FormGroup>
                  <FormLabel> <i className="fas fa-female left"></i> Select Gender  <span className="required">*</span></FormLabel>
                  <OverlayTrigger
                    key="top"
                    placement="left"
                    overlay={
                      <Tooltip id="tooltip-top">
                        <strong>{this.state.data + "%"}</strong>
                      </Tooltip>
                    }
                  >
                    <FormCheck
                      type="radio"
                      label="Male"
                      name="gender"
                      id="gender"
                      value="Male"
                      checked={this.state.gender === "Male"}
                      onChange={this.onInputChange}
                    // data-toggle="tooltip" data-placement="top" title={this.state.data + "%"}
                    />
                  </OverlayTrigger>

                  <OverlayTrigger
                    key="top"
                    placement="left"
                    overlay={
                      <Tooltip id="tooltip-top">
                        <strong>{this.state.data1 + "%"}</strong>
                      </Tooltip>
                    }
                  >
                    <FormCheck
                      type="radio"
                      label="Female"
                      name="gender"
                      id="gender"
                      value="Female"
                      checked={this.state.gender === "Female"}
                      onChange={this.onInputChange}
                      data-toggle="tooltip" data-placement="top" title={this.state.data1 + "%"}
                    /></OverlayTrigger>
                  {genderError ? <p style={{ color: "red" }}>{genderError}</p> : null}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup margin="normal">

                  <FormLabel><i className="fa fa-flag left"></i> Select Country <span className="required">*</span> </FormLabel>
                  <FormControl as="select" value={this.state.selectedCountry} onChange={this.handleChange}  >
                    {this.state.country.map((country, index) => {
                      return <option key={index}>{country.name}</option>
                    })

                    }
                  </FormControl>

                </FormGroup>
              </Col>
              <Col>
              <FormGroup>

                
                  <FormLabel> Region </FormLabel>
                  <FormControl as="select" value={this.state.region} onChange={this.handleChange} >
                    {
                      this.state.country.map((country) => {
                        return <option value={country.region}>{country.region}</option>
                      })
                    }
                  </FormControl>
               
              </FormGroup>
              </Col>
            </Row>
            <Row  >
              <Col>
                <FormGroup margin="normal">
                  <FormLabel> <i className="fa fa-list-alt left"></i> Select Category <span className="required">*</span> </FormLabel>
                  <FormControl as="select" name={"category"} value={this.state.category} onChange={this.onInputChange}>
                    <option value="">-Select Category Type-</option>
                    {categoryData && categoryData.length ? categoryData.map(category => {
                      return <option key={category._cid} >{category.category}</option>
                    })
                      : null})
            </FormControl>
                  {categoryError ? <p style={{ color: "red" }}>{categoryError}</p> : null}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup margin="normal">
                  <FormLabel><i className="fa fa-id-card left"></i>   Select Idproof <span className="required">*</span> </FormLabel>
                  <FormControl as="select" name={"idproof"} placeholder="Id Proof" value={idproof} onChange={this.onInputChange} >
                    <option value={""}>-Select Id Proof Type-</option>
                    <option value={"voterId"}>Voter id</option>
                    <option value={"aadhar"}>Aadhar card</option>
                    <option value={"passport"} >Passport</option>
                  </FormControl>
                  {idproofError ? <p style={{ color: "red" }}>{idproofError}</p> : null}
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <FormLabel> <i className="fas fa-image left"></i> Upload valid idproof <span className="required">*</span> </FormLabel>
              <FormControl name="file" type="file" onChange={this.onChangefile} placeholder={"choose file for idproof"} />
              {fileError ? <p style={{ color: "red" }}>{fileError}</p> : null}
            </FormGroup>
            <FormGroup align="center">
              <div className="imgPreview">{$imagePreview}</div>
            </FormGroup>


            <Link to="/login"><p>Already have an account!! Click here</p></Link>
            <Button
              type="submit"
              variant={"success"}
            > <i className="fas fa-user-plus left"></i>
              {isLoading ? "please wait.." : "Sign Up"}
            </Button><br />
          </form>
        </Col>
      </Row>

    )
  }
};

export default withRouter(Signup);