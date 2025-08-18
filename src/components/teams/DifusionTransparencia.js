import React from 'react';
import Team from '@/components/teams/Base/Team';
import { difusionTransparencia } from '@/utils/teamComite';

const DifusionTransparencia = () => {
  return (
    <Team 
      teamSubName="Comisión de Difusión y Transparencia"
      teamMembers={difusionTransparencia}
      isTecnicoTeam={true} 
    />
  );
}

export default DifusionTransparencia;
