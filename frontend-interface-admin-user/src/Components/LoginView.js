import React, { useContext, useCallback } from 'react';
import { withRouter, Redirect } from "react-router"
import { auth } from '../Conection/firebaseconection'
import { AuthContext } from "../context/auth"

//https://www.youtube.com/watch?v=ON87B1PJIlY -AUTENTICATION JWT
//https://www.youtube.com/watch?v=ZyKKP3rWSzU  --proteccion de rutas hardcore
//https://www.youtube.com/watch?v=i4cZmjN6kl0&t=143s ------rutas seguras

const Login = ({ history }) => {

    const [user, setUser] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onChangeUser = (e) => {
        setUser(e.target.value)
    }
    const onChangePass = (e) => {
        setPassword(e.target.value)
    }

    const closeLoginForm = (e) => {
        document.body.classList.remove("showLoginForm")
    }
    const onPushLogin = useCallback(async event => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {

            await auth.signInWithEmailAndPassword(email.value, password.value)
            //.then((res)=>alert("Usuario correcto"))
            history.push("/admin");

        } catch (error) {
            alert(error);
        }
    }, [history]);

    const { currentUser } = useContext(AuthContext)

    if (currentUser) {
        return <Redirect to="/admin" />
    }

    return (
        <div >
            <div className="popup-overlay" id="popup-overlay-login"></div>
            <div className="popup" id="popup-login">
                <div className="popup-close" onClick={closeLoginForm}>&times;</div>
                <form className="form" onSubmit={onPushLogin}>
                    <div className="avatar">
                        <img src="./images/logoapp.png" alt="" />
                    </div>
                    <div className="header">
                        Iniciar Sesión
                    </div>

                    <div class="form-label-group">
                        <input type="email" name="email" id="inputEmail" class="form-control" value={user} onChange={onChangeUser} placeholder="Email address" required autofocus />
                        <label for="inputEmail">Administrador</label>
                    </div>

                    <div class="form-label-group">
                        <input type="password" name="password" id="inputPassword" class="form-control" value={password} onChange={onChangePass} placeholder="Password" required />
                        <label for="inputPassword">Contraseña</label>
                    </div>

                    <button type="submit">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
}
export default withRouter(Login);