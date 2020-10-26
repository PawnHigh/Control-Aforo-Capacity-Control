import React,{useEffect,Fragment} from 'react';
function Aforo() {
    const [aforomax,setAforomax]=React.useState(100);
    const [inseguro,setAforoin]=React.useState(1);
    const [peligroso,setAforopel]=React.useState(1);
    const [editAforo,setEditAforo]=React.useState(false);


    const incrementslideinseguro=(e)=>{  
        setAforoin(e.target.value);
        console.log(e.target.value)
    }
    const incrementslidepeligroso=(e)=>{  
        setAforopel(e.target.value);
        console.log(e.target.value)
    }
    const closeAforoForm=()=>{
        document.body.classList.remove("showAforoForm")
    }
    const enablesettings=(e)=>{
        setEditAforo(e.target.checked);
        console.log(e.target.checked)
    }
    

    return (
        <div >
            <div className="popup-overlay" id="popup-overlay-aforo"></div>
            <div className="popup" id="popup-aforo">
                <div className="popup-close" onClick={closeAforoForm}>&times;</div>
                <div className="form">
  
                    <div className="header">
                    Datos de Aforo
                    </div>

                    
                    <div class="form-label-group">
                        <input type="number" id="inputEmail" class="form-control"  required autofocus/>
                        <label for="inputEmail">Aforo Máximo</label>
                    </div>
                    <div className="toggle-edit"> 
                        <label for="inputEmail" className="label-edit">Configurar alarmas</label>
                        <input class="tgl tgl-flat" id="cb4" onClick={enablesettings} type="checkbox"/>
                        <label class="tgl-btn" for="cb4"></label>
                    </div>
            

                    <div class="slidecontainer">
    <p>Aforo Peligroso: <span id="demo-peligroso">{peligroso}</span></p>
                        <input type="range" min={1} max={aforomax} value={peligroso} onChange={incrementslidepeligroso} class="slider" id="range-peligroso" disabled={!editAforo} step="1"/>
                        
                    </div>
                    <div class="slidecontainer">
    <p>Aforo Inseguro: <span id="demo-inseguro">{inseguro}</span></p>
                        <input type="range" min={1} max={aforomax} value={inseguro} onChange={incrementslideinseguro} class="slider" id="range-inseguro" disabled={!editAforo} step="1"/>
                        
                    </div>
                                            
                    <button>Guardar Datos</button>
                  
                </div>
            </div>
        </div>
  );
}
export default Aforo;
