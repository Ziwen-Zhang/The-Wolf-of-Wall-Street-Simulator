import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function UserHomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const [investingHistory, setInvestingHistory] = useState({
    prices: [],
    timestamps: [],
  });

  useEffect(() => {
    if (user) {

      const interval = setInterval(() => {
        setInvestingHistory((prevState) => {
          const now = new Date().toLocaleTimeString();
          const updatedPrices = [...prevState.prices, user.total_net_worth];
          const updatedTimestamps = [...prevState.timestamps, now];

          if (updatedPrices.length > 20) {
            updatedPrices.shift();
            updatedTimestamps.shift();
          }

          return {
            prices: updatedPrices,
            timestamps: updatedTimestamps,
          };
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) {
    return <div className="text-center text-gray-500">Loading user data...</div>;
  }

  const data = {
    labels: investingHistory.timestamps,
    datasets: [
      {
        label: "Investing",
        data: investingHistory.prices,
        borderColor: "rgba(0, 255, 0, 1)",
        borderWidth: 2,
        backgroundColor: "rgba(0, 0, 0, 0)",
        pointRadius: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="flex flex-col bg-gray-900 text-white">
      {/* Investing Section */}
      <div className="flex-grow bg-gray-800 p-6 rounded-md shadow-md mb-2">
        <h1 className="text-3xl font-bold text-yellow-300 mb-4">Investing</h1>
        <Line data={data} options={options} />
      </div>
      {/* Buying Power Section */}
      <div className="bg-gray-800 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-yellow-300 mb-2">Buying Power</h2>
        <div className="text-gray-300">
          <span className="text-lg font-bold text-teal-400">Available: </span>
          <span className="text-gray-200 text-xl">
            ${user.buying_power.toFixed(2)}
          </span>
        </div>
        <div>
            <span className="font-bold text-teal-400">Bank Debt: </span>
            <span className="text-gray-200">${user.bank_debt.toFixed(2)}</span>
          </div>
      </div>
    </div>
  );
}

export default UserHomePage;