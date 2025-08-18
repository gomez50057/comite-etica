import React from 'react';
import Team from '@/components/teams/Base/Team';
import { quejasDenuncias } from '@/utils/teamComite';


const QuejasDenuncias = () => {
  return (
    <Team
      teamSubName="Comisión de Quejas y Denuncias"
      teamMembers={quejasDenuncias}
      isTecnicoTeam={true}
    />
  );
}

export default QuejasDenuncias;
