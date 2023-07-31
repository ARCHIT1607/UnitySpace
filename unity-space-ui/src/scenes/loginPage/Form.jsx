import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
import Axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";

const registerSchema = yup.object().shape({
  fname: yup.string(),
  lname: yup.string(),
  email: yup.string().email("invalid email"),
  password: yup.string(),
  loc: yup.string(),
  course: yup.string(),
  picId: yup.string(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email"),
  password: yup.string(),
});

const initialValuesRegister = {
  fname: "",
  lname: "",
  email: "",
  password: "",
  loc: "",
  course: "",
  picture_name: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [image, setImage] = useState(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [sid, setSid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loc, setLoc] = useState("");
  const [course, setCourse] = useState("");

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    if (image) {
      formData.append("picture", image);
      formData.append("pictureName", image.name);
      try{
        const savedUserResponse = await Axios.post(
        "http://localhost:9000/auth/register",
        formData,
        {
          params: {
            fname: fname,
            lname: lname,
            sid: sid,
            email: email,
            password: password,
            loc: loc,
            course: course
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const savedUser = savedUserResponse;
      onSubmitProps.resetForm();
      console.log("in savedUser", savedUser)
      if (savedUser) {
        console.log("in savedUser")
        setEmail("");
        setPassword("");
        setPageType("login");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        window.alert("Session Expired Please login again")
        navigate("/");
      }
    }
    }else{
      window.alert("Please add profile picture")
    }
    

  };

  const login = async (values, onSubmitProps) => {
    console.log("login");
    const loggedIn = "";
    try {
      const loggedInResponse = await Axios.post(
        "http://localhost:9000/auth/login",{},
        {
          params: {
            email: email,
            password: password,
          },
        }
      );
      
      const loggedIn = loggedInResponse.data;
      console.log("loggedIn ",loggedInResponse);
      onSubmitProps.resetForm();
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/home");
    } catch (error) {
        console.error("Something bad happened");
        console.error(error.response.data.errorMsg);
        toast(error.response.data.errorMsg);
        setEmail("");
        setPassword("");
        navigate("/");
      }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <><ToastContainer></ToastContainer>
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleSubmit,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={(e) => setFname(e.target.value)}
                  value={values.fname}
                  name="fname"
                  error={Boolean(touched.fname) && Boolean(errors.fname)}
                  helperText={touched.fname && errors.fname}
                  sx={{ gridColumn: "span 2" }}
                  required
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={(e) => setLname(e.target.value)}
                  value={values.lname}
                  name="lname"
                  error={Boolean(touched.lname) && Boolean(errors.lname)}
                  helperText={touched.lname && errors.lname}
                  sx={{ gridColumn: "span 2" }}
                  required
                />
                <TextField
                  label="City"
                  onBlur={handleBlur}
                  onChange={(e) => setLoc(e.target.value)}
                  value={values.loc}
                  name="loc"
                  error={Boolean(touched.loc) && Boolean(errors.loc)}
                  helperText={touched.loc && errors.loc}
                  sx={{ gridColumn: "span 4" }}
                  required
                />
                <TextField
                  label="Course"
                  onBlur={handleBlur}
                  onChange={(e) => setCourse(e.target.value)}
                  value={values.course}
                  name="course"
                  error={Boolean(touched.course) && Boolean(errors.course)}
                  helperText={touched.course && errors.course}
                  sx={{ gridColumn: "span 2" }}
                  required
                />
                <TextField
                  label="Student ID"
                  onBlur={handleBlur}
                  onChange={(e) => setSid(e.target.value)}
                  value={values.sid}
                  name="sid"
                  error={Boolean(touched.sid) && Boolean(errors.sid)}
                  helperText={touched.sid && errors.sid}
                  sx={{ gridColumn: "span 2" }}
                  required
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  {
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        console.log("acceptedFiles[0])", acceptedFiles[0]);
                        setImage(acceptedFiles[0]);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <FlexBetween>
                          <Box
                            {...getRootProps()}
                            border={`2px dashed ${palette.primary.main}`}
                            p="1rem"
                            width="100%"
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          >
                            <input {...getInputProps()} />
                            {!image ? (
                              <p>Add Profile Picture Here</p>
                            ) : (
                              <FlexBetween>
                                <Typography>{image.name}</Typography>
                                <EditOutlined />
                              </FlexBetween>
                            )}
                          </Box>
                          {image && (
                            <IconButton
                              onClick={() => setImage(null)}
                              sx={{ width: "15%" }}
                            >
                              <DeleteOutlined />
                            </IconButton>
                          )}
                        </FlexBetween>
                      )}
                    </Dropzone>
                  }
                </Box>
              </>
            )}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={(e) => {
                setEmail(e.target.value)}}
              value={email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
              required
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
              required
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                console.log("pagetType ", pageType);
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
    </>
  );
};

export default Form;
