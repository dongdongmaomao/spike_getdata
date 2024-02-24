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
    const [chartInstance, setChartInstance] = useState(null);
    useEffect(() => {
        if (!loading && !error && data) {
            if (chartInstance == null) {
                const chart = echarts.init(document.getElementById('chart-container'));
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    xAxis: {
                        type: 'value',
                        name: 'time'
                    },
                    yAxis: {
                        type: 'value',
                        name: 'bendingMoment'
                    },
                    series: [
                        {
                            type: 'line',
                            data: []
                        }
                    ]
                };
                chart.setOption(option);
                setChartInstance(chart);
            }
        }
    }, [loading, error, data]);
    useEffect(() => {
        if (!loading && !error && data && chartInstance) {
            const xAxisData = data.listSpikes.map(item => item.currentSpikeData.time)[0];
            const seriesData = data.listSpikes.map(item => item.currentSpikeData.bendingMoment)[0];
            const option = chartInstance.getOption();
            if (option.series[0].data.length == 0) {
                option.xAxis[0] = {
                    type: 'value',
                    name: 'time',
                    min: xAxisData
                };
            }
            const newSeries = {
                type: 'line',
                data: [xAxisData, seriesData]
            };
            option.series[0].data.push([xAxisData, seriesData]); 
            chartInstance.setOption(option);
        }
    }, [loading, error, data, chartInstance])
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error:{error.message}</p>;
    return <div id="chart-container" style={{width:'1000px', height:'400px'}}/>;
};
export default ChartComponent