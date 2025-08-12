import React from 'react';
import Team from '@/components/teams/Team';
import { capacitacionSensibilizacion } from '@/utils/teamComite';


const CapacitacionSensibilizacion = () => {
  return (
    <Team
      teamSubName="Comisión de Capacitación y Sensibilización"
      teamMembers={capacitacionSensibilizacion}
      isTecnicoTeam={true}
    />
  );
}

export default CapacitacionSensibilizacion;
