import React from 'react'
import VistaAdmin from "./Components/MainView"
import VistaUser from "./Components/UserView"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import { AuthProvider } from "./context/auth"
import PrivateRoute from "./Protect/privateroute"
import Preloader from "./Components/Preloader"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Preloader />
        <Route exact path="/" component={VistaUser} />
        <PrivateRoute exact path="/admin" component={VistaAdmin} />
        <PrivateRoute path="/" component={VistaAdmin} />
      </Router>
    </AuthProvider>
  );
}

export default App;
