
import React,{useEffect} from 'react';
import Opcion from './Opcion'
import Login from './login'
import Modal from './modal'
import Aforo from './SetAforo'
import {db} from './Conection/conection'

const opciones_admin=[
  {id:0,title:"Estadisticas",name:"stadistics",icon:"ib-icon fa fa-bar-chart"},
  {id:1,title:"Establecimiento",name:"about",icon:"ib-icon fa fa-home"},
  {id:2,title:"Soporte Tecnico",name:"contact",icon:"ib-icon fa fa-wrench"}
]

const opciones_cliente=[
  {id:1,title:"Establecimiento",name:"about",icon:"ib-icon fa fa-home"},
  {id:2,title:"Soporte Tecnico",name:"contact",icon:"ib-icon fa fa-wrench"}
]

/*---------------------INICIO DEL COMPONENTE */
export default function VistaAdmin(props){

  const [aforoDatos,setAforoDatos]=React.useState({["maximo"]:100,["inseguro"]:65,["peligroso"]:85,["actual"]:0})
  const [opcion,setOpcion]=React.useState(5)
  const [estado,setEstado]=React.useState("normal")
  const [options,setOptions]=React.useState(opciones_cliente)
  const [user,setUser]=React.useState(0)
  //firebase
  



  //---------------Aforo edit data
  const addAforoStates=async(maximo,inseguro,peligroso,aforoactual)=>{
    await db.collection('aforodata').doc("HIVRbsZvDPaf0Ostc9BV").set({["maximo"]:maximo,["inseguro"]:inseguro,["peligroso"]:peligroso,["actual"]:aforoDatos.actual});
    console.log("datos guardados correctamente");

  }
  //-----------------Obtener los datos de aforo---------
  const getAforoStates=()=>{
    db.collection('aforodata').onSnapshot((querysnapshot)=>{
      const docs=[];
      querysnapshot.forEach((doc)=>{
          docs.push({...doc.data()});
      });


      setAforoDatos(docs[0]);
      console.log("<<<<<<<<<<<<<imprimiendo datos de aforo>>>>>>>>>>>>><<<");
      console.log(docs[0]);

      if(docs[0].actual<docs[0].inseguro) 
        {setNormal();}
      else if(docs[0].actual<docs[0].peligroso)
        { setInseguro();}
      else if(docs[0].actual<docs[0].maximo)
        { setPeligroso();}
      else if(docs[0].actual===docs[0].maximo)
        {setSaturado();}
    });
  }
  //---------useEffect cuando carga el navegador
  useEffect(()=>{
    getAforoStates() 
    if(props.user=="admin"){
      setUser(1)
      setOptions(opciones_admin)
    }
    
  },[]);



  const abrirOpcion=(number)=>{
    setOpcion(number);
    options.forEach(element => {
    if(element.id==number)
      document.getElementById(element.name).className+="active";
    else
      document.getElementById(element.name).className=document.getElementById(element.name).className.replace("active","");
    });
    document.getElementById("navigation").style.paddingBottom="3em"
  }
  const deletestatus=()=>{
      switch(estado){
        case "normal":document.body.classList.remove("normal"); console.log(estado); break;
        case "inseguro":document.body.classList.remove("inseguro"); console.log(estado); break;
        case "peligroso":document.body.classList.remove("peligroso"); console.log(estado); break;
        case "saturado":document.body.classList.remove("saturado");console.log(estado); break;
      }
  }
  const setNormal=()=>{

      deletestatus();
      document.body.classList.add("normal");
      setEstado("normal");
  }
  const setInseguro=()=>{
      deletestatus();
      document.body.classList.add("inseguro");
      setEstado("inseguro");
  }
  const setPeligroso=()=>{
    deletestatus();
    document.body.classList.add("peligroso");
    setEstado("peligroso");
  }
  const setSaturado=()=>{
    deletestatus();
    document.body.classList.add("saturado");
    setEstado("saturado");
  }
  
  const openLoginForm=()=>{
    document.body.classList.add("showLoginForm")
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
        <div className="header-main">
          <label htmlFor="btn-modal" className="lbl-modal"></label>
            <label htmlFor="btn-modal" className="lbl-modal"> <i class="isetting fas fa-users-cog"></i></label>
            <input type="checkbox" id="btn-modal"/>
            <Modal></Modal>
        </div>
      
          <div className="recint-name">
             SYSNAME
             <div className="recint-name-est">ESTABLECIMIENTO</div>
          </div>
          <div className="date">
            Sab, 31 Dic 2020
          </div>
      
        <div className="cont-main">
          <div className="circle">
            <div className="wave">
              <div className="cantidad">
                {aforoDatos.actual}
              </div>
            </div>
          </div>
          {/*<div className="alarm-notify">
              AFORO ESTABLE
          </div>
            */}
          {/*----------------------CLASIFY----------------------------------------------*/}
          <div className="aforoclasify">
          <div className="acestable">
              <div className="acvalue" onClick={deletestatus}> {"<"}{aforoDatos.inseguro}</div>
              <div className="acdesc">
                AFORO ESTABLE
                <div className="acdesc-detail">Indicador que anuncia situación de aforo estable</div>
              </div>

            </div>
            <div className="acinseguro">
              <div className="acvalue" onClick={setInseguro}>{aforoDatos.inseguro}</div>
              <div className="acdesc">
                AFORO INSEGURO
                <div className="acdesc-detail">Indicador que anuncia advertencia al sobrepasar {65.0/100.0} % del aforo</div>
              </div>

            </div>
            <div className="acpeligroso">
            <div className="acvalue" onClick={setPeligroso}>{aforoDatos.peligroso}</div>
              <div className="acdesc">
                AFORO PELIGROSO
                <div className="acdesc-detail">Indicador que anuncia advertencia al sobrepasar {80.0/100.0} % del aforo</div>
              </div>
            </div>
            <div className="acsaturado">
              <div className="acvalue" onClick={setSaturado}>{aforoDatos.maximo}</div>
              <div className="acdesc">
                AFORO MÁXIMO
                <div className="acdesc-detail">Indicador que anuncia peligro al llenar el 100 % del aforo</div>
              </div>
            </div>
          </div>
        </div>
        {/*----------------------CLASIFY END----------------------------------------------*/}
        

       {/* --------------------Items bottom--------------- */}
       <div className="itemsbottom">
          {options.map(element=>
            <div key={element.id} className={"ib-containers "+element.name} id={element.name} onClick={()=>abrirOpcion(element.id)}>
              <label>
                <i className={element.icon} aria-hidden="true"/>
                <div className="ib-title">
                  {element.title}
                </div>
              </label>
            </div>
          )}
        </div>
     
        {/* --------------------Items bottom END--------------- */}
 
 
        
          <Login></Login>
          <Aforo editAforoFun={addAforoStates}></Aforo>
  
      {/* --------------------Navigation--------------- */} 
      <div className="navigation" id="navigation">
          <div className="container-opcion">
            <Opcion tipo={opcion} user={user}/>
          </div>
        </div>
      {/* --------------------Navigation END---------------  <div className="end-page"></div>*/}
       

        </div>
    </div>
  );
}
