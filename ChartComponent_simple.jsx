import React, {useEffect, useState} from 'react';
import { useQuery, gql } from '@apollo/client'
import * as echarts from 'echarts'
const GET_DATA = gql`
  query {
    listSpikes {
      spikeId
      currentSpikeData{
        bendingMoment,
        axialForce,
        time,
        torsionalMoment,
      }
    }
  }
`;
const ChartComponent = () => {
    const { loading, error, data } = useQuery(GET_DATA, {pollInterval:100,});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error:{error.message}</p>;
    return data.listSpikes.map(({spikeId, currentSpikeData}) => (
        <div key={spikeId}>
            <h3>time:{currentSpikeData.time}</h3>
            <br/>
            <h3>bendingMoment:{currentSpikeData.bendingMoment}</h3>
            <br/>
            <h3>axialForce:{currentSpikeData.axialForce}</h3>
            <br/>
            <h3>torsionalMoment:{currentSpikeData.torsionalMoment}</h3>
            <br/>
        </div>
    ));
};
export default ChartComponent