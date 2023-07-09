import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useEffect } from "react";
import { getMessaging, messaging } from "components/firebase";
import { getToken, onMessage  } from "firebase/messaging";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  async function requestPermission (){
    const permission = await Notification.requestPermission();
      if(permission === "granted"){
        const token = await getToken(messaging,{vapidKey:'BBCz-opcNloxx-lcHRMg5OT82peYLYgh7RGZlzHeWRhUH64GqDVh-0bwVLEKzqUQfUncsCrdjZdEpufJrdui1L0'})
        console.log(token)
      }else if(permission === "denied"){
alert("You denied for the notification")
      }

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received', payload);
        alert(`${payload.notification.title}: ${payload.notification.body}`);
      });

      return () => {
        unsubscribe();
      };


    }

    useEffect(() => {
      requestPermission()
    }, [])
    


  

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              // element={isAuth ? <HomePage /> : <Navigate to="/" />}
              element={<HomePage />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
