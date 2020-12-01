import React from 'react'
import OpcionEstadisticas from './Option.statistics'
import OpcionEstablecimiento from "./Option.establishment"
import OpcionSoporteTecnico from "./Option.techsupport"

export default function Opcion(props) {
    let opcion;
    switch (props.tipo) {
        case 0:
            opcion = <OpcionEstadisticas data={props.data} />;
            break;
        case 1:
            opcion = <OpcionEstablecimiento data={props.data} user={props.user} />;
            break;
        case 2:
            opcion = <OpcionSoporteTecnico data={props.data} user={props.user} />;
            break;
        default:
            opcion = "";
            break;
    }
    return (
        <div className="container-opcion">
            {opcion}
        </div>
    );
}

