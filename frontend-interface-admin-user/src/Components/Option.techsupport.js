import React, { useEffect, Fragment } from 'react';
import emailjs from 'emailjs-com';
import { AuthContext } from '../context/auth';

export default function OpcionSoporteTecnico(props) {
  const [useradmin, setUserAdmin] = React.useState(false);
  const [showFormEmail, setShowFormEmail] = React.useState(false);

  /*const abrirwashapp = () => {
    window.open("https://wa.link/7yyakh");
  }

  const abrirfacebook = () => {
    window.open("https://www.facebook.com/");
  }

  const abrirTwitter = () => {
    window.open("https://wa.link/7yyakh");
  }

  const abrirInstagram = () => {
    window.open("https://www.facebook.com/");
  }*/
  const viewSendEmail = () => {
    if (showFormEmail) {
      setShowFormEmail(false);
    }
    else {
      setShowFormEmail(true);
    }
  }

  function sendEmail(e) {
    e.preventDefault();
    emailjs.sendForm('service_587t35k', 'template_6jlsg2i', e.target, 'user_M6MKj4btePclhLnp1X7aX')
      .then((result) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
  }

  const send_email =
    <div className="soporte-email-send">
      <label >Formulario de envio de correo</label>
      <form className="contact-form" onSubmit={sendEmail}>
        <div className="email-form-input">
          <label >Nombre:</label>
          <input id="name" class="input" name="name" type="text" placeholder="jose Martinez" />
        </div>
        <div className="email-form-input">
          <label >Email:</label>
          <input id="email" class="input" name="email" type="text" placeholder="ejemplo@hotmail.com" />
        </div>
        <div className="email-form-input">
          <label >Asunto:</label>
          <input id="subject" class="input" name="subject" type="text" placeholder="Desperfecto" />
        </div>
        <div className="email-form-input">
          <label >Mensaje:</label>
          <textarea id="message" class="input" name="message" placeholder="Me dirigo a ustedes ....."></textarea>
        </div>
        <input className="button-options" type="submit" value="Enviar Correo"></input>
      </form>
    </div>

  return (
    <div className="option">
      <div className="header" >
        Soporte Tecnico
        </div>
      {props.user == 0 && <div className="st-container">

        <div className="header" >
          Administrador del Local
        </div>
        <p className="description-techsupport" align="justify">
          Si desea comunicarnos con nosotros por alguna queja o desperfecto por nuestro servicio
          o desea contratar nuestro servicio para su negocio u otra interrogante, Sientase
          libre de comunicarce por los siguientes medios.
          Procuraremos reponderle lo mas antes posible.
        </p>
        <div class="social-btns">
          <a class="btn facebook" href="https://www.facebook.com/" target="_blank"><i class="fa fa-facebook"> </i> <label>Administrador</label></a>
          <a class="btn whatsapp" href="https://web.whatsapp.com/" target="_blank"><i class="fa fa-whatsapp"> </i> <label>Administrador</label></a>
          <a class="btn instagram" href="https://www.instagram.com/" target="_blank"><i class="fa fa-instagram"> </i> <label>Administrador</label> </a>
          <a class="btn youtube" href="https://www.youtube.com/" target="_blank"><i class="fa fa-youtube"> </i> <label>AforoCount</label> </a>
          <a class="btn email"><i class="fa fa-envelope"> </i><label> Administrador@gmail.com</label> </a>
        </div>
      </div>
      }
      <div className="st-container">
        {props.user == 0 && <div className="header">
          Contacto con nosotros
        </div>}
        <p className="description-techsupport" align="justify">
          Si desea comunicarnos con nosotros por alguna queja o desperfecto por nuestro servicio
          o desea contratar nuestro servicio para su negocio u otra interrogante, Sientase
          libre de comunicarce por los siguientes medios.
          Procuraremos reponderle lo mas antes posible.
        </p>
        <div class="social-btns">
          <a class="btn facebook" href="https://www.facebook.com/" target="_blank"><i class="fa fa-facebook"> </i> <label> AforoCount</label> </a>
          <a class="btn whatsapp" href="https://web.whatsapp.com/" target="_blank"><i class="fa fa-whatsapp"> </i> <label> AforoCount</label> </a>
          <a class="btn instagram" href="https://www.instagram.com/" target="_blank"><i class="fa fa-instagram"> </i> <label> AforoCount </label> </a>
          <a class="btn youtube" href="https://www.youtube.com/" target="_blank"><i class="fa fa-youtube"> </i><label> AforoCount </label> </a>
          {props.user == 1
            ? <a class="btn email" onClick={() => viewSendEmail()} ><i class="fa fa-envelope" target="_blank"> </i> <label> AforoCount@gmail.com</label> </a>
            : <a class="btn email" ><i class="fa fa-envelope" target="_blank"> </i> <label>AforoCount@gmail.com</label> </a>}
        </div></div>
      {showFormEmail &&
        <div className="container-op-soporte-email">
          {send_email}
        </div>}
    </div>
  );
}

