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
                    title: [
                        {
                            text: '弯矩',
                            left: 'center',
                            top: 0
                        },
                        {
                            text: '轴向力',
                            left: 'center',
                            top: '33%'
                        },
                        {
                            text: '扭矩',
                            left: 'center',
                            top: '66%'
                        }
                    ],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    grid: [
                        {top: '5%', height: '25%'},
                        {top: '40%', height: '25%'},
                        {top: '75%', height: '25%'}
                    ],
                    xAxis: [
                        {
                            gridIndex: 0,
                            type: 'value',
                            name: 'time'
                        },
                        {
                            gridIndex: 1,
                            type: 'value',
                            name: 'time'
                        },
                        {
                            gridIndex: 2,
                            type: 'value',
                            name: 'time'
                        }
                    ],
                    yAxis: [
                        {
                            gridIndex: 0,
                            type: 'value',
                        },
                        {
                            gridIndex: 1,
                            type: 'value',
                        },
                        {
                            gridIndex: 2,
                            type: 'value',
                        }
                    ],
                    series: [
                        {
                            type: 'line',
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            data: []
                        },
                        {
                            type: 'line',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: []
                        },
                        {
                            type: 'line',
                            xAxisIndex: 2,
                            yAxisIndex: 2,
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
            const newTime_data = data.listSpikes.map(item => item.currentSpikeData.time)[0];
            const newBendingMoment_data = data.listSpikes.map(item => item.currentSpikeData.bendingMoment)[0];
            const newAxialForce_data = data.listSpikes.map(item => item.currentSpikeData.axialForce)[0];
            const newTorsionalMoment_data = data.listSpikes.map(item => item.currentSpikeData.torsionalMoment)[0];
            const option = chartInstance.getOption();
            if (option.series[0].data.length == 0) {
                option.xAxis[0] = {
                    type: 'value',
                    name: 'time',
                    min: newTime_data
                };
                option.xAxis[1] = {
                    type: 'value',
                    name: 'time',
                    min: newTime_data
                };
                option.xAxis[2] = {
                    type: 'value',
                    name: 'time',
                    min: newTime_data
                };
            }
            option.series[0].data.push([newTime_data, newBendingMoment_data]); 
            option.series[1].data.push([newTime_data, newAxialForce_data]); 
            option.series[2].data.push([newTime_data, newTorsionalMoment_data]); 
            chartInstance.setOption(option);
        }
    }, [loading, error, data, chartInstance])
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error:{error.message}</p>;
    return <div id="chart-container" style={{width:'1000px', height:'400px'}}/>;
};
export default ChartComponent