import React from 'react'
import VistaAdmin from "./Components/MainView"
import VistaUser from "./Components/UserView"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import { AuthProvider } from "./context/auth"
import PrivateRoute from "./Protect/privateroute"
import Preloader from "./Components/Preloader"
import UserPresent from "./Components/userConfirmProvider"



function App() {
  return (
    <AuthProvider>
      <Router>
        <Preloader />
        <UserPresent/>
        <Route exact strict path="/" component={VistaUser} />
        <PrivateRoute exact strict path="/admin" component={VistaAdmin} />
         {/*<PrivateRoute path="/" component={VistaAdmin} />*/}
      </Router>
    </AuthProvider>
  );
}

export default App;
