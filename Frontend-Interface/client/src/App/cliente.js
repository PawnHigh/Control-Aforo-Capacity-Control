
import React,{useEffect,Fragment} from 'react';
//import Modal from './modal.js'

  
function VistaCliente(){
const [aforomax,setAforomax]=React.useState(45);

  useEffect(()=>{
    getAforomax()
  },[])

  const getAforomax=async()=>{
    const data=await fetch("http://localhost:4000/api/")
    const afmax=await data.json() 
    setAforomax(aforomax)
  }
  
  return (
    
      <div class="containerapp">
  
        <div class="containercapa">

        <div className="recint-name">
          Supermercado Nueva Esperanza (CLIENTE)
        </div>
        

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
            <div className="acdesc">AFORO INSEGURO</div>

          </div>
          <div className="acpeligroso">
            <div className="acvalue">80</div>
            <div className="acdesc">AFORO PELIGROSO</div>
          </div>
          <div className="acmaximo">
            <div className="acvalue">100</div>
            <div className="acdesc">AFORO MÁXIMO</div>
          </div>
        </div>
        {/*----------------------CLASIFY END----------------------------------------------*/}
        
        {/* --------------------Items bottom--------------- */}
    
        <div className="itemsbottom">
        
        <div className="ib-containers stadistics">
          
          <i class="ib-icon fa fa-bar-chart" aria-hidden="true"></i>
          <div className="ib-title">Estadisticas</div>
          <div className="ib-desc">Puedes ver la concurrencia diaria de este establecimiento</div>

        </div>
        <div className="ib-containers about">
          <i class="ib-icon fa fa-home" aria-hidden="true"></i>
          <div className="ib-title">Establecimiento</div>
          <div className="ib-desc"> Encuentra información sobre el establecimiento</div>

        </div>
        <div className="ib-containers contact">
        <i class="ib-icon fa fa-wrench" aria-hidden="true"></i>

          <div className="ib-title">Soporte Técnico</div>
          <div className="ib-desc">Contacta al equipo técnico en caso de fallas</div>
        </div>
      </div>

        {/* --------------------Items bottom END--------------- */}
        </div>

      {/*<Modal> </Modal>*/}  
    </div>
  );
}
  export default VistaCliente;