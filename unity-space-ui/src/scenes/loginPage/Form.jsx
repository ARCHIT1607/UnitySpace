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
  fname: yup.string().required("first name is required"),
  lname: yup.string().required("last name is required"),
  email: yup.string().email("invalid email"),
  password: yup.string()
  .min(6, "Password must be at least 6 characters")
  .required("Password is required"),
  loc: yup.string().required("city is required"),
  course: yup.string().required("course is required"),
  sid: yup.string().matches(
    /^[a-z]{3}[0-9]{2}$/)
  .required("student id is required ex. asm63")
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email"),
  password: yup.string()
  .min(6, "Password must be at least 6 characters")
  .required("Password is required"),
});

const initialValuesRegister = {
  fname: "",
  lname: "",
  email: "",
  password: "",
  loc: "",
  course: "",
  sid: ""
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
  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
     console.log("values ",value)
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
            fname: values.fname,
            lname: values.lname,
            sid: values.sid,
            email: values.email,
            password: values.password,
            loc: values.loc,
            course: values.course
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
        setPageType("login");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast(error.response.data.errorMsg);
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
      console.log("values ", values.email)
    try {
      const loggedInResponse = await Axios.post(
        "http://localhost:9000/auth/login",{},
        {
          params: {
            email: values.email,
            password: values.password,
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
        handleChange,
        handleSubmit,
        setFieldValue,
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
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
