import React from 'react';
import Team from '@/components/teams/TeamProtocoloCero';
import { protocoloCero } from '@/utils/teamProtocoloCero';

const ProtocoloCero = () => {
  return (
    <Team 
      teamName="Protocolo Cero"
      teamSubName="Círculo de Confianza UPLAPH"
      teamMembers={protocoloCero}
      isTecnicoTeam={true} 
    />
  );
}

export default ProtocoloCero;
