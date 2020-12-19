import React, { useEffect, Fragment } from 'react';
import { db } from '../Conection/firebaseconection'


export default function OpcionEstablecimiento(props) {

  const [edicionImagen, setEdicionImagen] = React.useState(0);
  const [imageCargada, setImageCargada] = React.useState(false);
  const [informationCompany, setInformationCompany] = React.useState(props.data);
  useEffect(() => {
    if (props.user == 1) {
      restaurar()
    }
    return () => {
      if (props.user == 1) {
        if (document.getElementById("charge-image")) {
          const file = document.getElementById("charge-image");
          file.addEventListener('change', (e) => {
            const data = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(data)
            reader.onload = () => {
              setImageCargada(true);
              document.getElementById("image-preview").style.height = "auto";
              document.getElementById("imagen-subida").src = reader.result;
            }
          })
        }
      }
    }
  });

  const habilitaredicion = () => {
    if (edicionImagen == 0) {
      document.getElementById("edit-image").style.display = "block"
      setEdicionImagen(1)
      document.getElementById("image-preview").style.height = "20em"
    }
    else {
      setEdicionImagen(0)
      document.getElementById("edit-image").style.display = "none";
    }
  }

  const cancelarimagen = () => {
    habilitaredicion();
    setImageCargada(false);
  }

  const guardar = async () => {
    const imagendata = document.getElementById("imagen-subida").src
    setInformationCompany({
      ...informationCompany, imagen: imagendata
    })
    setEdicionImagen(0)
    document.getElementById("edit-image").style.display = "none";
    setImageCargada(false);
    await db.collection('aforodata').doc("HIVRbsZvDPaf0Ostc9BV").update(
      {
        imagen: imagendata
      })
  }

  const restaurar = () => {
    document.getElementById("input-name-company").value = informationCompany.local;
    document.getElementById("input-descripcion-company").value = informationCompany.descripcion;
    document.getElementById("input-direccion-company").value = informationCompany.direccion;
    document.getElementById("input-timetable-company").value = informationCompany.horario;
  }

  const guardarCambios = async () => {
    document.getElementById("edicion-enable").style.display = "block"
    document.getElementById("save").style.display = "none"
    document.getElementById("restore").style.display = "none"
    document.getElementById("cancel").style.display = "none"
    document.getElementById("input-name-company").disabled = true;
    document.getElementById("input-descripcion-company").disabled = true;
    document.getElementById("input-direccion-company").disabled = true;
    document.getElementById("input-timetable-company").disabled = true;
    setInformationCompany({
      ...informationCompany,
      local: document.getElementById("input-name-company").value,
      descripcion: document.getElementById("input-descripcion-company").value,
      direccion: document.getElementById("input-direccion-company").value,
      horario: document.getElementById("input-timetable-company").value
    })
    await db.collection('aforodata').doc("HIVRbsZvDPaf0Ostc9BV").update(
      {
        local: document.getElementById("input-name-company").value,
        descripcion: document.getElementById("input-descripcion-company").value,
        direccion: document.getElementById("input-direccion-company").value,
        horario: document.getElementById("input-timetable-company").value
      }
    )
  }

  const cancelar = () => {
    restaurar()
    document.getElementById("edicion-enable").style.display = "block"
    document.getElementById("save").style.display = "none"
    document.getElementById("restore").style.display = "none"
    document.getElementById("cancel").style.display = "none"
    document.getElementById("input-name-company").disabled = true;
    document.getElementById("input-descripcion-company").disabled = true;
    document.getElementById("input-direccion-company").disabled = true;
    document.getElementById("input-timetable-company").disabled = true;
  }

  const habilitarediciondescripcion = () => {
    document.getElementById("input-name-company").disabled = false;
    document.getElementById("input-descripcion-company").disabled = false;
    document.getElementById("input-direccion-company").disabled = false;
    document.getElementById("input-timetable-company").disabled = false;
    document.getElementById("edicion-enable").style.display = "none"
    document.getElementById("save").style.display = "block"
    document.getElementById("restore").style.display = "block"
    document.getElementById("cancel").style.display = "block"
  }

  let content_descripcion;
  const descripcion_cliente =
    <div>
      <div className="container-descripcion">
        <p align="justify">
          {informationCompany.descripcion}
          <br></br><br></br>
          <strong>Direccion: </strong>
          {informationCompany.direccion}
          <br></br>
          <strong>Horario de atencion: </strong>
          {informationCompany.horario}
        </p>
      </div>
    </div>

  const descripcion_admin =
    <div className="establisment-edit" style={{ padding: "1em", boxSizing: "border-box" }}>
      <div className="email-form-input">
        <label>Nombre de la Empresa</label >
        <input type="text" id="input-name-company" placeholder="Nombre de la Empresa" disabled="true" />
      </div>
      <div className="email-form-input" >
        <label >Descripcion de la Empresa</label>
        <textarea id="input-descripcion-company" placeholder="Descripcion de la Empresa" disabled="true" />
      </div>
      <div className="email-form-input">
        <label>Dirreccion :</label>
        <input type="text" id="input-direccion-company" placeholder="Direccion de la empresa" disabled="true" />
      </div>
      <div className="email-form-input" >
        <label >Horario de atencion :</label>
        <input type="text" id="input-timetable-company" placeholder="Direccion de la empresa" disabled="true" />
      </div>
      <div className="buttons-edition">
        <button class="edition-button button-options" id="edicion-enable" onClick={() => habilitarediciondescripcion()}>Habilitar edicion</button>
        <button class="edition-button button-options" id="restore" onClick={() => restaurar()} style={{ display: "none" }}>Restaurar Valores</button>
        <button class="edition-button button-options" id="save" onClick={() => guardarCambios()} style={{ display: "none" }}>Guarda Cambios</button>
        <button class="edition-button button-options" id="cancel" onClick={() => cancelar()} style={{ display: "none" }}>Cancelar</button>
      </div>
    </div>

  let content_image;
  const image_cliente =
    <div className="img-establishment-container" >
      <img className="img-establishment" src={informationCompany.imagen} />
    </div>;

  const image_admin =
    <div>
      {image_cliente}
      <button class="button-options" onClick={() => habilitaredicion()}>Editar imagen</button>
      <div className="container-edit-image" id="edit-image" style={{ display: "none", marginTop: "2em" }}>
        <input type="file" id="charge-image"></input>
        <label for="charge-image">Selecione la Imagen</label>
        <div className="preview-image" id="image-preview" style={{
          border: "dashed 2px rgba(57,76,132,.5)", boxSizing: "border-box", borderRadius: "10px", width: "95%", marginLeft: "2.5%", marginTop: "2em", marginBottom: "2em", padding: "1em", display: "flex",
          justifyContent: "center", alignItems: "center", background: "white"
        }}>
          {imageCargada
            ? <img id="imagen-subida" ></img>
            : <div><i class="fa fa-file-image-o" style={{ width: "100%", height: "auto", fontSize: "6em", color: "#A9A9A9" }}></i><label style={{ color: "#A9A9A9", fontSize: "2em" }}>Vista previa</label></div>
          }
        </div>
        <div className="buttons-edition">
          {imageCargada && <button class="edition-button button-options" onClick={() => guardar()}>Guardar</button>}
          <button class="edition-button button-options" onClick={() => cancelarimagen()}>Cancelar</button>
        </div>
      </div>
    </div>;

  switch (props.user) {
    case 0: {
      content_image = image_cliente;
      content_descripcion = descripcion_cliente;
      break;
    }
    case 1: {
      content_image = image_admin;
      content_descripcion = descripcion_admin;
      break;
    }
    default: {
      content_image = "En Construccion";
      content_descripcion = "En Construccion";
      break;
    }
  }

  return (
    <div className="option">
      <div className="header">{informationCompany.local}</div>
      <div className="st-container">
        {content_descripcion}
        {content_image}
      </div>
    </div>)
}
