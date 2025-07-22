import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

interface PredictionChartProps {
    predictionX1?: number | null; // Cottoni Basah
    predictionX2?: number | null; // Cottoni Kering
    predictionX3?: number | null; // Spinosum Basah
    predictionX4?: number | null; // Spinosum Kering
    dataRumputlautX1?: number[] | null; // Actual data for Cottoni Basah
    dataRumputlautX2?: number[] | null; // Actual data for Cottoni Basah
    dataRumputlautX3?: number[] | null; // Actual data for Cottoni Basah
    dataRumputlautX4?: number[] | null; // Actual data for Cottoni Basah
}

const PredictionChart = ({
    predictionX1,
    predictionX2,
    predictionX3,
    predictionX4,
    dataRumputlautX1,
    dataRumputlautX2,
    dataRumputlautX3,
    dataRumputlautX4,
}: PredictionChartProps) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {

                // Prediction chart with all four datasets
                const predictionChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dataRumputlautX1
                            ? [...dataRumputlautX1.map((_, index) => ` ${index + 1}`), 'Prediksi']
                            : ['Prediksi'],
                        datasets: [
                            // Actual Cottoni Basah data
                            {
                                label: 'Actual Cottoni Basah',
                                data: [...(dataRumputlautX1 || []), null],
                                fill: false,
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 3,
                            },
                            {
                                label: 'Actual Cottoni Kering',
                                data: [...(dataRumputlautX2 || []), null],
                                fill: false,
                                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 3,
                            },
                            {
                                label: 'Actual Spinosum Basah',
                                data: [...(dataRumputlautX3 || []), null],
                                fill: false,
                                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 3,
                            },
                            {
                                label: 'Actual Spinosum Kering',
                                data: [...(dataRumputlautX4 || []), null],
                                fill: false,
                                 backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 3,
                            },
                            // Predicted Cottoni Basah
                            {
                                label: 'Prediksi Cottoni Basah',
                                data: [...(dataRumputlautX1 || []).map((item) => item), predictionX1],
                                fill: false,
                                backgroundColor: 'rgba(77, 255, 190, 0.5)',
                                borderColor: 'rgba(77, 255, 190, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 5,
                                borderDash: [5, 5],
                            },
                            // Predicted Cottoni Kering
                            {
                                label: 'Prediksi Cottoni Kering',
                                data: [...(dataRumputlautX2 || []).map((item)=> item), predictionX2],
                                fill: false,
                                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 5,
                                borderDash: [5, 5],
                            },
                            // Predicted Spinosum Basah
                            {
                                label: 'Prediksi Spinosum Basah',
                                data: [...(dataRumputlautX3 || []).map((item)=> item), predictionX3],
                                fill: false,
                                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 5,
                                borderDash: [5, 5],
                            },
                            // Predicted Spinosum Kering
                            {
                                label: 'Prediksi Spinosum Kering',
                                data: [...(dataRumputlautX4 || []).map((item)=> item), predictionX4],
                                fill: false,
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 5,
                                borderDash: [5, 5],
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Periode',
                                },
                            },
                            y: {
                                beginAtZero: false,
                                title: {
                                    display: true,
                                    text: 'Nilai Produktivitas',
                                },
                            },
                        },
                    },
                });

                return () => {
                    predictionChart.destroy();
                };
            }
        }
    }, [predictionX1, predictionX2, predictionX3, predictionX4]);

    return (
            <div className='w-full flex flex-col items-center h-max'>
                <h3>Hasil Prediksi Produktivitas Rumput Laut</h3>
                <canvas ref={chartRef} className='w-full h-max'></canvas>
            </div>
    );
};

export default PredictionChart;
