import React from 'react';
import Team from '@/components/teams/Team';
import { asesores } from '@/utils/teamComite';

const Asesores = () => {
  return (
    <Team 
      teamSubName="Comisión de Difusión y Transparencia"
      teamMembers={asesores}
      isTecnicoTeam={true} 
    />
  );
}

export default Asesores;
