import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import mapMarkerImg from '../images/map-marke.svg'
import { FiPlus,FiArrowRight } from 'react-icons/fi'
import { Map,TileLayer, Marker, Popup } from 'react-leaflet'
import '../styles/pages/OrphanageMap.css'
import 'leaflet/dist/leaflet.css'
import MapIcon from '../utils/mapIcon'
import api from '../services/api'
import Orphanage from './Orphanage'
interface Orphanage {
    id: number;
    latitude: number;
    longitude: number;
    name:string;

}



function OrphanageMap(){

    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    useEffect(()=> {
        api.get('orphanages').then(response => {
            setOrphanages(response.data);
        });
    },[]);
    return(
    <div id='page-map'>
        <aside>
            <header>
                <img src={mapMarkerImg} alt="Happy"/>

                <h2> Escolha um orfanato no mapa</h2>
                <p>Muitas crianças estão
                    esperando a sua visita :)
                </p>
            </header>
            <footer>
                <strong>Senhor do Bonfim</strong>
                <span>Bahia</span>
            </footer>
        </aside>

        <Map center={[-10.4562688,-40.189952]} zoom={13} style={{ width: '100%' , height: '100%' }} >
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}/>
               
        {orphanages.map(orphanage => {
            return(
             <Marker icon={MapIcon}
                position={[orphanage.latitude,orphanage.longitude]} key={orphanage.id}>
            <Popup closeButton={false} minWidth={240} maxHeight={240} className="map-popup">
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}>
                    <FiArrowRight size={20} color='#fff'/>
                </Link>

            </Popup>
                
            </Marker>
            )
        })}    
        </Map>
        <Link to='/orphanages/create' className='create-ophanage'>
            <FiPlus size={32} color="#fff"/>
        </Link>
    </div>

    )}

export default OrphanageMap;