import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import  Axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import badWords from 'bad-words';

const MyPostWidget = ({ picturePath , fromProfile, userPicturePath}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const { palette } = useTheme();
  const { sid,course } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    const formData = new FormData();
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const response = await Axios.post("http://localhost:9000/posts", formData, {
        params: {
          description: description,
          userId:sid,
          userPicturePath:userPicturePath
        },
        headers: {
          Authorization: "Bearer " + token.token,
          "Content-Type": "multipart/form-data"
        },
      });
      const posts = await response.data;
      dispatch(setPosts({ posts }));
      console.log("after creating post ",posts)
      setImage(null);
      // setPost("");
      setDescription("");
      console.log("fromProfile ",fromProfile)
      if(fromProfile){
        getUserPosts();
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        window.alert("Session Expired Please login again")
        navigate("/");
      }
    }
  };
  
  const getUserPosts = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:9000/posts/${sid}/posts`,
        {
          headers: { Authorization: "Bearer " + token.token},
        }
      );
      const data = await response.data;
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        window.alert("Session Expired Please login again")
        navigate("/");
      }
    }
  };

  const handleTextChange = (event) => {
    const filter = new badWords();
    filter.removeWords("hell");
    const newText = event.target.value ? event.target.value : '';
    if(filter.isProfane(newText)){
      toast("Inappropriate Content detected");
      setDescription("")
    }else{
      setDescription(newText);
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's ons your mind..."
          onChange={handleTextChange}
          value={description}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          { <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => {console.log("acceptedFiles[0])",acceptedFiles[0]); setImage(acceptedFiles[0])}}
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
                    <p>Add Media Here</p>
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
          </Dropzone> }
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween style={{justifyContent:"space-around"}}>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)} >
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
            <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Clip
          </Typography>
        </FlexBetween>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          // disabled={!post}
          disabled={!description}
          onClick={handlePost}
          sx={{
            color: "grey",
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
