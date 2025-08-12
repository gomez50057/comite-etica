import React from 'react';
import Team from '@/components/teams/Team';
import { presidenciaSecretaria } from '@/utils/teamComite';

const PresidenciaSecretaria = () => {
  return (
    <Team 
      teamName="Comité de Ética y Prevención de Conflictos de Interés de la UPLAPH Periodo 2025-2026"
      teamSubName="Presidencia y Secretaría"
      teamMembers={presidenciaSecretaria}
      isTecnicoTeam={true} 
    />
  );
}

export default PresidenciaSecretaria;
