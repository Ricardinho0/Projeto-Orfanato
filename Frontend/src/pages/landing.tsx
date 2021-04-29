import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'


import '../styles/pages/landin.css'
import LogoImg from '../images/Logo.svg'


function Landing(){
    return(
        <div id="page-landing">
      <div className="content-wrapper">
          <img src={LogoImg} alt="Happy"/>

          <main>
            <h1>Leve Felicidade para o mundo</h1>
            <p>visite orfanatos e mude o dia de muitas crianças </p>
          </main>
          <div className='location'>
            <strong>Senhor do Bonfim</strong>
            <span>Bahia</span>
          </div>

          <Link to="/app" className='enter-app'>
            <FiArrowRight size={26} color="rgb(141, 115, 75)"/>
          </Link>


      </div>
    </div>
    );
}

export default Landing;