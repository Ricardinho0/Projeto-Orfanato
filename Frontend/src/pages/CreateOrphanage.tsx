import React, { FormEvent, useState, ChangeEvent } from "react";
import { Map, Marker, TileLayer} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import {  FiPlus } from "react-icons/fi";
import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/sidebar";
import MapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";



export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName]= useState('');
  const [about, setAbout]= useState('');
  const [insntructions, setInstructions]= useState('');
  const [opening_hours, setOpeningHours ] = useState('');
  const [open_on_weekends, setOpeOnWeekdens] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([])



  function handlerMapClick(event: LeafletMouseEvent){
    const {lat, lng} = event.latlng
    setPosition({
      latitude: lat,
      longitude: lng
    })
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files){
      return;
    }
  
  
  
    const SelectedImages = Array.from(event.target.files);


    setImages(SelectedImages);


    const SelectedImagesPreview = SelectedImages.map(image => {
      return URL.createObjectURL(image);
    })
    setPreviewImages(SelectedImagesPreview)
}




  
  
  
  async function handlerSubmit(event:FormEvent){
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name',name);
    data.append('about',about);
    data.append('latitude',String(latitude));
    data.append('longitude',String(longitude));
    data.append('insntructions',insntructions);
    data.append('opening_hours',opening_hours);
    data.append('open_on_weekends',String(open_on_weekends));
    

    images.forEach(image => {
      data.append('images', image)
    })


    await api.post('orphanages', data);

    alert('Cadastro Realizado com Sucesso!');

    history.push('/app');

  }

  return (
    <div id="page-create-orphanage">
      
      <Sidebar/>

      <main>
        <form onSubmit={handlerSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-10.4644419,-40.1797107]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handlerMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
            { position.latitude  !== 0 &&
             <Marker interactive={false} icon={MapIcon} position={[position.latitude,position.longitude]} />}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} 
              value={about} 
              onChange={event => setAbout(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="image-container">
                {previewImages.map(image => {
                  return (
                    <img key={image}src={image} alt={name}/>
                  )
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>

               

              </div>
              <input multiple onChange={handleSelectImages} type="file" id="image[]"/>  
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="insntructions">Instruções</label>
              <textarea id="insntructions" 
              value={insntructions} 
              onChange={event => setInstructions(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento</label>
              <input id="opening_hours" 
              value={opening_hours} 
              onChange={event => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana ?</label>

              <div className="button-select">
                <button
                 type="button" 
                 className={open_on_weekends ? 'active' : ''}
                 onClick={()=> setOpeOnWeekdens(true)}
                 >Sim
                 </button>
                <button 
                type="button"
                className={!open_on_weekends ? 'active' : ''}
                onClick={()=> setOpeOnWeekdens(false)}
                >Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
