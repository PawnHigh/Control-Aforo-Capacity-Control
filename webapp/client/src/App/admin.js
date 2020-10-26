
import React,{useEffect,Fragment} from 'react';
import Opcion from './Opcion'
import Login from './login'
import Aforo from './SetAforo'

const botones=[{id:0,name:"stadistics"},{id:1,name:"about"},{id:2,name:"contact"},{id:3,name:"modific-aforo"}]

function VistaAdmin(){
  const [aforomax,setAforomax]=React.useState(45);
  const [opcion,setOpcion]=React.useState(5);

  useEffect(()=>{
    getAforomax()
  },[])

  const getAforomax=async()=>{
    const data=await fetch("http://localhost:4000/api/")
    const afmax=await data.json() 
    setAforomax(aforomax)
  }
  
  const abrirOpcion=(number)=>{
        setOpcion(number);
        
        botones.forEach(element => {
          if(element.id==number)
          document.getElementById(element.name).style.backgroundColor='#E3E4E5';
          else
          document.getElementById(element.name).style.backgroundColor='#ffffff';
        });
  }
  const openLoginForm=()=>{
    document.body.classList.add("showLoginForm")
  }
  const openAforoForm=()=>{
    document.body.classList.add("showAforoForm")
  }

  return (
    <div className="containerapp">
        
        <div className="containercapa">

        {/*----------------------MODAL----------------------------------------------*/}
       {/*<div className="content-setting">
        
        <label htmlFor="btn-modal" className="lbl-modal"> <i class="isetting fas fa-users-cog"></i></label>
        <input type="checkbox" id="btn-modal"/>
        <Modal></Modal>
      </div>*/}
        {/*----------------------MODAL END----------------------------------------------*/}
        <div className="recint-name">
            Nombre del Establecimiento
          </div>
        <div className="cont-main">
          <div className="circle">
            <div className="wave">
              <div className="cantidad">
                {aforomax}
              </div>
              
            </div>
          </div>
          {/*<div className="alarm-notify">
              AFORO ESTABLE
          </div>
            */}
          {/*----------------------CLASIFY----------------------------------------------*/}
          <div className="aforoclasify">
            <div className="acinseguro">
              <div className="acvalue">65</div>
              <div className="acdesc">
                AFORO INSEGURO
                <div className="acdesc-detail">Es un indicador para anunciar cuando el aforo empieza a acercarse al Limíte</div>
              </div>

            </div>
            <div className="acpeligroso">
            <div className="acvalue" onClick={openAforoForm}>80</div>
              <div className="acdesc">
                AFORO PELIGROSO
                <div className="acdesc-detail">Es un indicador para anunciar cuando el aforo empieza a acercarse al Limíte</div>
              </div>
            </div>
            <div className="acmaximo">
              <div className="acvalue" onClick={openLoginForm}>100</div>
              <div className="acdesc">
                AFORO MÁXIMO
                <div className="acdesc-detail">Es un indicador para anunciar cuando el aforo empieza a acercarse al Limíte</div>
              </div>
            </div>
          </div>
        </div>
        {/*----------------------CLASIFY END----------------------------------------------*/}
        

       {/* --------------------Items bottom--------------- */}
       <div className="itemsbottom" >
        <div className="ib-containers stadistics" id="stadistics"   onClick={()=>abrirOpcion(0)}>
        <label  >
          <i className="ib-icon fa fa-bar-chart" aria-hidden="true"></i>
          <div className="ib-title">Estadisticas</div></label>
          
          <div className="ib-desc">Ver la concurrencia diaria de este establecimiento</div>

        </div>
        <div className="ib-containers about" id="about" onClick={()=>abrirOpcion(1)}>
        <label >
          <i className="ib-icon fa fa-home" aria-hidden="true"></i>
          <div className="ib-title">Establecimiento</div></label>
           <div className="ib-desc"> Encuentra información sobre el establecimiento</div> 

        </div>
        <div className="ib-containers contact" id="contact" onClick={()=>abrirOpcion(2)}>
        <label  >
        <i className="ib-icon fa fa-wrench" aria-hidden="true"></i>
          <div className="ib-title">Soporte Técnico</div></label>
          <div className="ib-desc">Contacta al equipo técnico en caso de fallas</div> 
        </div>
 <div className="ib-containers modific-aforo" id="modific-aforo" onClick={()=>abrirOpcion(3)}>
        <label   >
        <i className="ib-icon fa fa-pencil" aria-hidden="true"></i>
          <div className="ib-title">Cambiar Aforo</div></label>
         <div className="ib-desc">Modificacion del maximo de aforo y otros cambios</div> 
        </div>     
        {/* --------------------Items bottom END--------------- */}
        </div> 
 
        
          <Login></Login>
          <Aforo></Aforo>
  
      {/* --------------------Navigation--------------- */} 
      <div className="navigation">
        <div className="container-opcion">
          <Opcion tipo={opcion}></Opcion>
        </div>
      </div>
      {/* --------------------Navigation END---------------  <div className="end-page"></div>*/}
       

        </div>
    </div>
  );
}
  export default VistaAdmin;