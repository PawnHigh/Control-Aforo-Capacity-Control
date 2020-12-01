import React, { useEffect } from 'react';
import Opcion from './Option'
import Modal from './SettingsView'
import Aforo from './AforoView'
import { db } from '../Conection/firebaseconection'
import { motion } from "framer-motion"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const opciones_admin = [
  { id: 0, title: "Estadisticas", name: "stadistics", icon: "ib-icon fa fa-bar-chart" },
  { id: 1, title: "Establecimiento", name: "about", icon: "ib-icon fa fa-home" },
  { id: 2, title: "Soporte Tecnico", name: "contact", icon: "ib-icon fa fa-wrench" }
]

/*---------------------INICIO DEL COMPONENTE */
const VistaAdmin = (props) => {

  const [aforoDatos, setAforoDatos] = React.useState({ ["maximo"]: 100, ["inseguro"]: 65, ["peligroso"]: 85, ["actual"]: 0 })
  const [opcion, setOpcion] = React.useState(4)
  const [estado, setEstado] = React.useState("normal")
  const [options, setOptions] = React.useState(opciones_admin);
  const [user, setUser] = React.useState(0)
  const [percent, setPercent] = React.useState(0)
  const [risk, setRisk] = React.useState('containercapa')
  const [data, setData] = React.useState({})
  //firebase


  //---------------Aforo edit data
  const addAforoStates = async (maximo, inseguro, peligroso, aforoactual) => {
    await db.collection('aforodata').doc("HIVRbsZvDPaf0Ostc9BV").update(
      {
        ["maximo"]: maximo,
        ["inseguro"]: inseguro,
        ["peligroso"]: peligroso,
      }
    );
  }
  //-----------------Obtener los datos de aforo---------
  const getAforoStates = () => {
    db.collection('aforodata').onSnapshot((querysnapshot) => {
      const docs = [];
      querysnapshot.forEach((doc) => {
        docs.push({ ...doc.data() });
      });
      setAforoDatos(docs[0]);
      const percent = ((docs[0].actual * 1.0) / (docs[0].maximo * 1.0)) * 100;

      if (percent <= 100)
        setPercent(Math.ceil(percent / 4))
      else {
        setPercent(25)
      }

      if (docs[0].actual < docs[0].inseguro) { setNormal(); }
      else if (docs[0].actual < docs[0].peligroso) { setInseguro(); }
      else if (docs[0].actual < docs[0].maximo) { setPeligroso(); }
      else if (docs[0].actual >= docs[0].maximo) { setSaturado(); }
    });
  }
  //---------useEffect cuando carga el navegador
  useEffect(() => {
    const timeout = setTimeout(() => {
      document.body.classList.add("loaded");
    }, 2000);
    getAforoStates()
    setUser(1)
    setOptions(opciones_admin)
    getDatos();
    return () => clearTimeout(timeout);
  }, []);

  const getDatos = async () => {
    const res = await db.collection('aforodata').doc("HIVRbsZvDPaf0Ostc9BV").get()
    setData(res.data())
  }
  const abrirOpcion = (number) => {
    setOpcion(number);
    document.getElementById("navigation").style.paddingBottom = "3em"
  }

  const setNormal = () => {
    setRisk('containercapa')
    toast('Seguro', {
      type: 'success',
      autoClose: 2500,
    })
    setEstado(estado => 'normal');
  }
  const setInseguro = () => {
    setRisk('containercapa')
    toast('Inseguro', {
      type: 'warning',
      autoClose: 4500,
    })
    setEstado(estado => 'inseguro');
  }
  const setPeligroso = () => {
    setRisk('containercapa')
    toast('Peligroso', {
      type: 'error',
      autoClose: 5500,
    })
    setEstado(estado => 'peligroso');
  }
  const setSaturado = () => {
    setRisk('containercapa2')
    toast('Saturado', {
      type: 'info',
      autoClose: false,
    })
    setEstado(estado => 'saturado')
  }

  //animations


  const variants = {
    /*rotate: { rotate: [0, -30, 0], transition: { duration: 0.5 } },*/
    // You can do whatever you want here, if you just want it to stop completely use `rotate: 0`
    stop: { y: [-8, 8, -8], transition: { duration: 3, loop: Infinity } }
  };
  return (
    <div className={`containerapp showLoginForm ${estado} a${percent}`}>
      <div className={`${risk}`}>

        {/*----------------------MODAL END----------------------------------------------*/}
        <div className="header-main">


          <label htmlFor="btn-modal" className="lbl-modal"></label>
          <label htmlFor="btn-modal" className="lbl-modal">

            <i class="isetting fas fa-users-cog" />

          </label>
          <input type="checkbox" id="btn-modal" />
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
          <div className="circle-content-shadow">

            <motion.div className="circle" animate={variants.stop}>
              <div className="wave">
                <div className="cantidad">
                  {aforoDatos.actual}
                </div>
                <div className="content-drops">
                  <div className='water-drop-before' />
                  <div className='water-drop' />
                  <div className='water-drop-after' />
                </div>
              </div>

            </motion.div>
          </div>
          {/*----------------------CLASIFY----------------------------------------------*/}
          <div className="aforoclasify">
            <div className="acestable">
              <div className="acvalue">{"<"}{aforoDatos.inseguro}</div>
              <div className="acdesc">
                AFORO ESTABLE
                <div className="acdesc-detail">Indicador que anuncia situación de aforo estable</div>
              </div>
            </div>
            <div className="acinseguro">
              <div className="acvalue" > {aforoDatos.inseguro}</div>
              <div className="acdesc">
                AFORO INSEGURO
                <div className="acdesc-detail">Indicador que anuncia advertencia al sobrepasar {65} % del aforo</div>
              </div>

            </div>
            <div className="acpeligroso">
              <div className="acvalue" >{aforoDatos.peligroso}</div>
              <div className="acdesc">
                AFORO PELIGROSO
                <div className="acdesc-detail">Indicador que anuncia advertencia al sobrepasar {80} % del aforo</div>
              </div>
            </div>
            <div className="acsaturado">
              <div className="acvalue" >{aforoDatos.maximo}</div>
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
          {options.map(element =>
            <div key={element.id} className={`ib-containers ${opcion === element.id ? 'active' : ''}`} id={element.name} onClick={() => abrirOpcion(element.id)}>
              <label>
                <i className={element.icon} aria-hidden="true" />
                <div className="ib-title">
                  {element.title}
                </div>
              </label>
            </div>
          )}
        </div>

        {/* --------------------Items bottom END--------------- */}

        <Aforo editAforoFun={addAforoStates}></Aforo>

        {/* --------------------Navigation--------------- */}
        <div className="navigation" id="navigation">
          <div className="container-opcion">
            <Opcion tipo={opcion} user={user} data={data} />
          </div>
        </div>
        {/* --------------------Navigation END---------------  <div className="end-page"></div>*/}
      </div>
      <ToastContainer />
    </div>
  );
}
export default VistaAdmin;