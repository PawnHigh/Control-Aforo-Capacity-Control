import React from 'react';
import OpcionEstadisticas from './OpcionEstadisticas';
import OpcionEstablecimiento from  "./OpcionEstablecimiento";
import OpcionSoporteTecnico from "./OpcionSoporteTecnico";

export default function Opcion(props) {
    let opcion;
    switch(props.tipo){
        case 0:
            opcion=<OpcionEstadisticas/>;
            break;
        case 1:
            opcion=<OpcionEstablecimiento user={props.user}/>;
            break;
        case 2:
            opcion=<OpcionSoporteTecnico user={props.user}/>;
            break;
        default:
            opcion="";
            break;
    }
    return (
        <div className="container-opcion">
            {opcion}
        </div>
    );
}

