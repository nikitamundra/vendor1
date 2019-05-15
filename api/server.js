
const express = require("express");
var bcrypt = require("bcrypt");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/vender", { useNewUrlParser: true });
const User = require("./model/users");
const Category = require("./model/category")
const product = require("./model/product")
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var asset = multer({dest: 'assets/' })
const cors = require("cors");
const { check, body, validationResult } = require("express-validator/check")
const nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken");


const verifytoken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({
      message: "unauthorize access"
    });
  }
  const token = req.headers["authorization"].replace("Bearer ", "");
  jwt.verify(token, "nikita", function (err, decoded) {
    if (err) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }
    req.currentUser = decoded;
    next();
  });
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname ));


app.post("/addUser", upload.single('file'), [
  //name validation
  check("username")
    .not().isEmpty().withMessage('Name cant be empty')
    .not().isNumeric().withMessage('you cant use digit or Special symbol here'),
  //Email validation 
  check("email")
    .not().isEmpty().withMessage('Email cant be empty')
    .isEmail().withMessage('Enter the valid email')

    .custom(async (email, { req, res }) => {
      const userData = await User.findOne({ email })
      if (userData) {
        throw new Error("user already exists.");
      }
    }),
  check("password")
    .not().isEmpty().withMessage('Password cant be empty')
    .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number')
    .isLength({ max: 13 }).withMessage('max length of password is 13')
    .custom((value, { req }) => {
      if (value !== req.body.cpassword) {
        throw new Error('Password confirmation is incorrect');
      }
      return true;
    })
    .withMessage("password did't match"),
  check("mobile")
    .not().isEmpty().withMessage('Mobile no. cant be empty')
    .isInt().withMessage('character not allowed')
    .isLength({ min: 7 }).withMessage('Mobile no. max length is 10')
    .isLength({ max: 14 }).withMessage('Mobile no. max length is 10'),
]
  , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array()
      });
    }
    // First read existing users.
    try {
      const { body, file } = req;
      const Password = req.body.password;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(Password, salt);
      const user = new User({ ...body, file: `${file.destination}${file.filename}`, password: hash });
      const result = await user.save();
      if (!result) {
        res.status(200).json({
          result,
          message: "Data not get.",
        });
      } else if (result) {
        res.status(200).json({
          files: req.file,
          body: req.body
        })
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: 'nikitam.chapter247@gmail.com',
            pass: 'nikita@247'
          }
        });
        var mailOptions = {
          from: 'nikitam.chapter247@gmail.com',
          to: req.body.email,
          subject: 'SignUp successful',
          text: 'Welcome  ' + req.body.username + ', you are sucessfully SignUp '
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({
              result,
              message: "Mail sent sucessfully",
            });
          }
        });
        res.status(200).json({
          result,
          message: "Data get.",
          sucess: true
        });
      }
    } catch (error) {
      res.status(500).json({
        message:
          error.message ||
          "An unexpected error occure while processing your request.",
      });
    }
  });
app.get("/users", async (req, res) => {
  // First read existing users.
  try {
    const result = await User.find();
    // const result1 = await Category.find();
    res.status(200).json({
      result,
      message: "Data get.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});
app.get("/category", async (req, res) => {
  // First read existing users.
  try {
    const result1 = await Category.find();
    res.status(200).json({
      result1,
      message: "Data get.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});

app.post( "/login", [
  check("email")
  .not()
  .isEmpty()
  .withMessage("Email can't be empty")
  .isEmail()
  .withMessage("Enter the valid email")
  ,
  check("password")
  .not()
  .isEmpty()
  .withMessage("Password can't be empty")
  ],
  async (req, res) => {
  try {
  const { body } = req;
  const Email = body.email;
  const Password = body.password;
  const result = await User.findOne({ email: Email });
  console.log(result);
  if (!result) {
  res.status(400).json({
  message: "Email is not registerd.",
  success: false
  });
  }
  const check = bcrypt.compareSync(Password, result.password);
  if (!check) {
  res.status(400).json({
  message: "password didn't match.",
  success: false
  });
  } else {
  const object = { ...result._doc };
  var token = jwt.sign(object, "nikita", { expiresIn: "8h" });
  res.status(200).json({
  token,
  result,
  message: "Logged in successfully!",
  success: true
  });
  }
  } catch (error) {
  console.log(error);
  
  res.status(500).json({
  message: error.message || "unwanted error occurred."
  });
  }
  }
  );

app.put('/addImage/:_id', asset.single('jumpsuit1'), (req, res) => {
  res.status(200).json({
    files: req.file,
    body: req.body

  })
})

app.post("/addproduct",verifytoken, [check("ptitle").not().isEmpty(),check("pdesc").not().isEmpty(),check("pprice").not().isEmpty(),check("psprice").not().isEmpty(),] , asset.single('file'), async (req, res) => {
  // First read existing users.
  try {
    const { body , file } = req;
    const user = new product({...body , file: `${file.destination}${file.filename}`});
    const result = await user.save();
    
    if (!result) {
      res.status(200).json({
        result,
        message: "Data get."
      });
    } else if (result) {
      res.status(200).json({
        files: req.file,
        body: req.body
      })
    }
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});

app.post("/showproduct", async (req, res) => {
  // First read existing users.
  try {
    const value = req.body.cId;
    const result = await product.find({cId: value});
    res.status(200).json({
      result,
      message: "Data get.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});

app.get("/productdata/:_id", async (req, res) => {
  // First read existing users.
  try {
    const result = await product.findById({_id : req.params._id});
    console.log(result) 
    if(!result){
      res.status(200).json({
        files: req.file,
      result,
      message: "Data deleted "
    })
    }
    else
    res.status(200).json({
      result,
      message: "Data get.",
    });
   }catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});

app.put("/update/:_id", asset.single('file'), async (req, res) => {

  try {
    const { body , file } = req;
    let obj = body;
    if(body.imageUpdated === "true") {
      obj ={
        ...obj,
        file: `${file.destination}${file.filename}`
      }
    }
    const result = await product.findByIdAndUpdate(
      { _id: req.params._id },
      { $set: obj}
    );
   
      res.status(200).json({
        files: req.file,
        body: req.body,
        result,
        message: "data updated"
     
    })
  } catch (error) {
    res.status(500).json({
      message: error.message  ||
      "An unexpected error occure while processing your request.",
    });
  }
});




app.post("/userdata", async (req, res) => {
  // First read existing users.
  try {
    const value = req.body.cId;
    const result = await User.findById({_id: value});
    console.log(result) 
    if(!result){
      res.status(200).json({
      result,
      message: "Data not found "
    })
    }
    else
    res.status(200).json({
      result,
      message: "Data get.",
    });
   }catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});


app.post("/countfemale", async (req, res) => {
  // First read existing users.
  try {
    const result = await User.find({"gender" :"Female"}).count();
    console.log(result) 
    if(!result){
      res.status(200).json({
      result,
      message: "Data not found "
    })
    }
    else
    res.status(200).json({
      result,
      message: "Data get.",
    });
   }catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});
app.post("/countmale", async (req, res) => {
  // First read existing users.
  try {
    const result = await User.find({"gender" :"Male"}).count();
    console.log(result) 
    if(!result){
      res.status(200).json({
      result,
      message: "Data not found "
    })
    }
    else
    res.status(200).json({
      result,
      message: "Data get.",
    });
   }catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});

app.delete("/delete/:_id", async (req, res) => {
  // First read existing users.
  try {
    const { params } = req;
    const result = await product.findByIdAndDelete(params._id);
    console.log(result);
    res.status(200).json({
      result,
      message: "Data deleted.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});