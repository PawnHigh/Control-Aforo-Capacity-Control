//import React,{useEffect,Fragment} from 'react';
import React from 'react';
function Login() {
    const closeLoginForm=()=>{
        document.body.classList.remove("showLoginForm")
      }
    return (
        <div >
            <div className="popup-overlay" id="popup-overlay-login"></div>
            <div className="popup" id="popup-login">
                <div className="popup-close" onClick={closeLoginForm}>&times;</div>
                <div className="form">
                    <div className="avatar">
                    <img src="./recursos/fondo6.jpeg" alt=""/>
                    </div>
                    <div className="header"> 
                    Iniciar Sesión
                    </div>
                   
                    <div class="form-label-group">
                        <input type="text" id="inputEmail" class="form-control" placeholder="Email address" required autofocus/>
                        <label for="inputEmail">Administrador</label>
                    </div>

                    <div class="form-label-group">
                        <input type="password" id="inputPassword" class="form-control" placeholder="Password" required/>
                        <label for="inputPassword">Contraseña</label>
                    </div>
                    
                    <button>Login</button>
                  
                </div>
            </div>
        </div>
  );
}
export default Login;
