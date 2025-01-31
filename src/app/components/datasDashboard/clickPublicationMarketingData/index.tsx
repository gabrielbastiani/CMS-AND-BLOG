import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface ClickMarketingProps {
    publicationsClickMetrics: any;
}

export function ClickPublicationMarketingData({ publicationsClickMetrics }: ClickMarketingProps) {

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                ticks: {
                    font: { size: 10 },
                },
            },
            y: {
                ticks: {
                    font: { size: 10 },
                },
            },
        },
    };

    const dailyViewsChartData = publicationsClickMetrics
        ? {
            labels: publicationsClickMetrics.dailyClicks.map((publication: { title: any; }) => publication.title),
            datasets: [
                {
                    label: 'Cliques Diários',
                    data: publicationsClickMetrics.dailyClicks.map((publication: { clicks: any; }) => publication.clicks),
                    backgroundColor: '#FF6384',
                },
            ],
        }
        : null;

    const weeklyClickChartData = publicationsClickMetrics
        ? {
            labels: publicationsClickMetrics.weeklyClick.map((publication: { title: any; }) => publication.title),
            datasets: [
                {
                    label: 'Cliques Semanais',
                    data: publicationsClickMetrics.weeklyClick.map((publication: { clicks: any; }) => publication.clicks),
                    backgroundColor: '#36A2EB',
                },
            ],
        }
        : null;

    const monthlyClickChartData = publicationsClickMetrics
        ? {
            labels: publicationsClickMetrics.monthlyClick.map((publication: { title: any; }) => publication.title),
            datasets: [
                {
                    label: 'Cliques Mensais',
                    data: publicationsClickMetrics.monthlyClick.map((publication: { clicks: any; }) => publication.clicks),
                    backgroundColor: '#FFCE56',
                },
            ],
        }
        : null;

    return (
        <div className="bg-white shadow-md rounded-lg p-4">

            <h2 className="text-lg font-semibold text-black mb-4">Cliques em Publicidades</h2>

            <div className="space-y-4">
                <div className="rounded-md border p-3" style={{ height: '250px' }}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Cliques Diários</h4>
                    {dailyViewsChartData && <Bar data={dailyViewsChartData} options={chartOptions} />}
                </div>

                <div className="rounded-md border p-3" style={{ height: '250px' }}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Cliques Semanais</h4>
                    {weeklyClickChartData && <Bar data={weeklyClickChartData} options={chartOptions} />}
                </div>

                <div className="rounded-md border p-3" style={{ height: '250px' }}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Cliques Mensais</h4>
                    {monthlyClickChartData && <Bar data={monthlyClickChartData} options={chartOptions} />}
                </div>
            </div>
        </div>
    )
};