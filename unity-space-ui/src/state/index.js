import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  messages: null,
  currentChat:[],
  currentGroupChat:[]
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.messages = null;
      state.currentChat = [];
    },
    setFriends: (state, action) => {
      if (state.user) {
        console.log("payload ",action.payload)
        state.user.friends = action.payload.friends;
        console.log("state.user.friends ",state.user.friends)
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setMessages: (state, action) => {
      console.log("payload ",action.payload)
      console.log("state ",state)
      state.messages = action.payload.messages;
    },
    setCurrentChat: (state, action) => {
      console.log("cuurenChat payload ",action.payload)
      state.currentChat = action.payload;
    },
    setCurrentGroupChat: (state, action) => {
      console.log("CurrentGroupChat payload ",action.payload)
      state.currentGroupChat = action.payload;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post.id === action.payload.post.id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setMessages,setCurrentChat,setCurrentGroupChat} =
  authSlice.actions;
export default authSlice.reducer;
