
//import React,{useEffect,Fragment} from 'react';
import { auth } from "../Conection/firebaseconection"
import React from 'react';

function Modal() {
  const openAforoForm = () => {
    document.body.classList.add("showAforoForm")
  }

  return (
    <div className="modal">
      <div className="contenido">
        <div className="setting-login-option" onClick={openAforoForm}>Datos de aforo <i class="fa fa-wrench" aria-hidden="true"></i></div>
        <div className="setting-aforo-option" onClick={() => auth.signOut()}>Cerrar sesión <i class="fa fa-sign-out" aria-hidden="true"></i></div>
      </div>
    </div>

  );
}
export default Modal;
