import React from 'react';
import PresidenciaSecretaria from '@/components/teams/PresidenciaSecretaria';
import DifusionTransparencia from '@/components/teams/DifusionTransparencia';
import CapacitacionSensibilizacion from '@/components/teams/CapacitacionSensibilizacion';
import QuejasDenuncias from '@/components/teams/QuejasDenuncias';
import Asesores from '@/components/teams/Asesores';


const ComiteComponent = () => {
  return (
    <div>
      <PresidenciaSecretaria />
      <DifusionTransparencia />
      <CapacitacionSensibilizacion />
      <QuejasDenuncias />
      <Asesores />
    </div>
  );
};

export default ComiteComponent;

