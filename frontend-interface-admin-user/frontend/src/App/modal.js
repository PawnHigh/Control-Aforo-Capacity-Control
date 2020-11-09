
//import React,{useEffect,Fragment} from 'react';
import React from 'react';
function Modal() {
    const openAforoForm=()=>{
    document.body.classList.add("showAforoForm")
  }
    return (
            <div className="modal">
                    <div className="contenido">
                        <div className="setting-login-option" onClick={openAforoForm}>Datos de aforo <i class="fa fa-wrench" aria-hidden="true"></i></div>
                        <div className="setting-aforo-option">Cerrar sesión <i class="fa fa-sign-out" aria-hidden="true"></i></div>
                    </div>
            </div>
 
  );
}
export default Modal;
