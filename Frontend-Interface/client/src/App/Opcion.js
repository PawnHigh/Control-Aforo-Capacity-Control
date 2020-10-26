import React from 'react';
import OpcionEstadisticas from './Opcionestadisticas';
import OpcionEstablecimiento from  "./Opcionestablecimiento";
import OpcionSoporteTecnico from "./Opcionsoportetecnico";
import OpcionEditarAforo from "./OpcionEditarAforo";

export default function Opcion(props) {
    console.log(".......holaaaaaaaaaaaaa........")
    let tipodemodal;
    switch(props.tipo){
        case 0:
            tipodemodal=<OpcionEstadisticas/>;
            break;
        case 1:
            tipodemodal=<OpcionEstablecimiento/>;
            break;
        case 2:
            tipodemodal=<OpcionSoporteTecnico/>;
            break;
        case 3:
            tipodemodal=<OpcionEditarAforo/>;
            break;
        default:
            tipodemodal="";
            break;
}
    return (
        <div className="container-opcion">
            {tipodemodal}
        </div>
  );}

