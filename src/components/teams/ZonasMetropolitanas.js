"use client";

import React, { useState } from 'react';
import ComiteComponent from './ZM/ComiteComponent';
import ProtocoloCeroComponent from './ZM/ProtocoloCeroComponent';
import styles from './ZonasMetropolitanas.module.css';

const ZonasMetropolitanas = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('eleccionCEPCI'); // Estado para la zona seleccionada
  const [fade, setFade] = useState('fade-in'); // Estado para el efecto de fade

  // Función para cambiar de zona
  const handleZonaChange = (zona) => {
    setFade('fade-out');
    setTimeout(() => {
      setZonaSeleccionada(zona);
      setFade('fade-in');
    }, 300); // Retraso para la animación
  };

  return (
    <div className={styles.zonasContainer}>
      {/* Selector de Zonas */}
      <div className={styles.selector}>
        <button
          className={`${zonaSeleccionada === 'eleccionCEPCI' ? styles.active : ''}`}
          onClick={() => handleZonaChange('eleccionCEPCI')}
        >
          CEPCI
        </button>
        <button
          className={`${zonaSeleccionada === 'eleccionProtocoloCero' ? styles.active : ''}`}
          onClick={() => handleZonaChange('eleccionProtocoloCero')}
        >
          Protocolo Cero
        </button>
      </div>

      {/* Renderizado Condicional del Componente basado en la Zona Seleccionada */}
      <div className={`${styles.zonaContent} ${styles[fade]}`}>
        {zonaSeleccionada === 'eleccionCEPCI' ? (
          <ComiteComponent />
        ) : (
          <ProtocoloCeroComponent zona={zonaSeleccionada} />
        )}
      </div>
    </div>
  );
};

export default ZonasMetropolitanas;
