import React,{useEffect,Fragment} from 'react';
//import emailjs from 'emailjs-com';

export default function OpcionSoporteTecnico(props) {
  const abrirwashapp=()=>{
    window.open("https://wa.link/7yyakh");
  }

  const abrirfacebook=()=>{
    window.open("https://www.facebook.com/");
  }

 /* function sendEmail(e){
    e.preventDefault();
    emailjs.sendForm('service_587t35k', 'template_6jlsg2i', e.target,'user_M6MKj4btePclhLnp1X7aX')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
    
  }*/

/*const send_email=
  <form className="contact-form" onSubmit={sendEmail}>
    <div className="soporte-email-send">
      <div className="soporte-email-right">
        <label for="name" style={{fontWeight:"bold"}}>Nombre:</label><br />
        <input id="name" class="input" name="name" type="text" style={{width:"95%",height:"1.5em",fontFamily:"Dosis",textAlign:"justify",
          fontSize:"1em",borderRadius:"5px",marginTop:"0.5em"}}/><br />
        <label  for="email" style={{fontWeight:"bold"}}>Email:</label><br />
        <input id="email" class="input" name="email" type="text"style={{width:"95%",height:"1.5em",fontFamily:"Dosis",textAlign:"justify",
          fontSize:"1em",borderRadius:"5px",marginTop:"0.5em"}}/><br />
        <label for="subject" style={{fontWeight:"bold"}}>Asunto:</label><br />
        <input id="subject" class="input" name="subject" type="text" style={{width:"95%",height:"1.5em",fontFamily:"Dosis",textAlign:"justify",
          fontSize:"1em",borderRadius:"5px",marginTop:"0.5em"}}/><br />
      </div>
      <div className="soporte-email-left">
        <label for="message" style={{fontWeight:"bold"}}>Mensaje:</label><br/>
        <textarea id="message" class="input" name="message" style={{width:"95%",fontSize:"1em",fontFamily:"Dosis",height:"9.7em",resize:"none",textAlign:"justify",borderImage:"initial",borderWidth:"2px",borderRadius:"5px",marginTop:"0.5em"}} ></textarea><br />
        <center><input className="button-options" type="submit"></input></center>
      </div>
    </div>
  </form>
  ;*/

    return (
      <div className="option">
        <div className="header" style={{marginBottom:"1em",fontSize:"1.5em"}}>
          Soporte Tecnico
        </div> 
        {props.user==0 && <div>
          <div className="header" style={{marginBottom:"1em",fontSize:"1.5em"}}>
          Administrador del Local
        </div> 
        <p align="justify">
        Si desea comunicarnos con nosotros por alguna queja o desperfecto por nuestro servicio 
        o desea contratar nuestro servicio para su negocio u otra interrogante, Sientase 
        libre de comunicarce por los siguientes medios.
        Procuraremos reponderle lo mas antes posible.  
        </p> 
        <div className="container-op-soporte">
          <div className="soporte-whatsapp" onClick={()=>abrirwashapp()}>
            <i class="fab fa-whatsapp"/> WhatsApp 
            <div className="soporte-title">
              9598985114
            </div>
          </div>
          <div className="soporte-facebook" onClick={()=>abrirfacebook()}>
            <i class="fab fa-facebook"/> Facebook
            <div className="soporte-title">
              CountCapacity 
            </div>
          </div>
          <div className="soporte-twitter" >
            <i class="fa fa-twitter"/> Twitter 
            <div className="soporte-title">
              9598985114
            </div>
           
          </div>
          <div className="soporte-instagram" >
            <i class="fa fa-instagram"/> Instragram
            <div className="soporte-title">
              CountCapacity 
            </div>
          </div>
        </div>

        
        <div className="container-op-soporte-email">
        <div className="soporte-gmail">
            <i class="far fa-envelope"/> Email 
              <div className="soporte-title">
                countcapacity@gmail.com
              </div>   
          </div>
      </div>
</div>}

       { props.user==0 && <div className="header" style={{marginBottom:"1em",fontSize:"1.5em"}}>
          Contacto con nosotros
        </div>} 
        <p align="justify">
        Si desea comunicarnos con nosotros por alguna queja o desperfecto por nuestro servicio 
        o desea contratar nuestro servicio para su negocio u otra interrogante, Sientase 
        libre de comunicarce por los siguientes medios.
        Procuraremos reponderle lo mas antes posible.  
        </p> 
        <div className="container-op-soporte">
          <div className="soporte-whatsapp" onClick={()=>abrirwashapp()}>
            <i class="fab fa-whatsapp"/> WhatsApp 
            <div className="soporte-title">
              9598985114
            </div>
          </div>
          <div className="soporte-facebook" onClick={()=>abrirfacebook()}>
            <i class="fab fa-facebook"/> Facebook
            <div className="soporte-title">
              CountCapacity 
            </div>
          </div>
          <div className="soporte-twitter" >
            <i class="fa fa-twitter"/> Twitter 
            <div className="soporte-title">
              9598985114
            </div>
           
          </div>
          <div className="soporte-instagram" >
            <i class="fa fa-instagram"/> Instragram
            <div className="soporte-title">
              CountCapacity 
            </div>
          </div>
        </div>

        <div className="container-op-soporte-email">
        <div className="soporte-gmail">
            <i class="far fa-envelope"/> Email 
              <div className="soporte-title">
                countcapacity@gmail.com
              </div>   
          </div>
        {/*props.user==1 && send_email*/}
      </div> </div>
  );
}

