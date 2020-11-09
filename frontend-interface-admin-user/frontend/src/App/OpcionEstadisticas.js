import React,{useEffect,Fragment} from 'react';
import Bar from './graphics/Bar';
import Line from './graphics/Line'
export default function OpcionEstadisticas() {
    return (
            <div className="option">
              <div className="header" style={{marginBottom:"2em",fontSize:"1.5em"}}>Estadisticas</div> 
                <Line/>
              <div style={{paddingBottom:"3em"}}></div>
                <Bar/>
            </div>
            
  );
}

