import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkAuthenticate } from "../../redux/session";
import { thunkLoan, thunkRepay } from "../../redux/loan";
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
import { thunkGetStocks } from "../../redux/stock";
import StockSideBar from "../HomePage/StockSideBar";

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
  const [loanAmount, setLoanAmount] = useState(0);
  const [repayAmount, setRepayAmount] = useState(0);
  const [maxloan, setMaxloan] = useState(1000000 - user.bank_debt);
  const [maxRepay, setMaxRepay] = useState(user.bank_debt);

  useEffect(() => {
    if (user) {
      setMaxloan(1000000 - user.bank_debt);
      setMaxRepay(user.bank_debt);
    }
  }, [user]);

  const handleLoanAmount = (e) => {
    const inputValue = parseFloat(e.target.value);
    if (isNaN(inputValue) || inputValue <= 0) {
      setLoanAmount(0);
    } else {
      setLoanAmount(Math.min(inputValue, maxloan));
    }
  };

  const handleRepayAmount = (e) => {
    const inputValue = parseFloat(e.target.value);
    if (isNaN(inputValue) || inputValue <= 0) {
      setRepayAmount(0);
    } else {
      setRepayAmount(Math.min(inputValue, user.buying_power, maxRepay));
    }
  };

  const [investingHistory, setInvestingHistory] = useState(() => {
    const storedHistory = localStorage.getItem("investingHistoryData");
    return storedHistory
      ? JSON.parse(storedHistory)
      : { prices: [], timestamps: [] };
  });

  const initialNetWorth = 100000;

  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(() => {
        dispatch(thunkAuthenticate());
        dispatch(thunkGetStocks());
      }, 3000);

      return () => clearInterval(refreshInterval);
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        setInvestingHistory((prevState) => {
          const now = new Date().toLocaleTimeString();
          const updatedPrices = [...prevState.prices, user.total_net_worth];
          const updatedTimestamps = [...prevState.timestamps, now];

          if (updatedPrices.length > 500) {
            updatedPrices.shift();
            updatedTimestamps.shift();
          }

          const newHistory = {
            prices: updatedPrices,
            timestamps: updatedTimestamps,
          };

          localStorage.setItem(
            "investingHistoryData",
            JSON.stringify(newHistory)
          );

          return newHistory;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-gray-500">Loading user data...</div>
    );
  }

  const handleLoanMoney = () => {
    dispatch(thunkLoan(loanAmount));
    setLoanAmount(0);
    dispatch(thunkAuthenticate());
  };

  const handleRepayMoney = () => {
    dispatch(thunkRepay(repayAmount));
    setRepayAmount(0);
    dispatch(thunkAuthenticate());
  };

  const lineColor =
    user.total_net_worth >= initialNetWorth + user.bank_debt
      ? "rgba(0, 255, 0, 1)"
      : "rgba(255, 0, 0, 1)";

  const data = {
    labels: investingHistory.timestamps,
    datasets: [
      {
        label: "Investing",
        data: investingHistory.prices,
        borderColor: lineColor,
        borderWidth: 2,
        backgroundColor: "rgba(0, 0, 0, 0)",
        pointRadius: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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

  const totalEarnings = user.total_net_worth - initialNetWorth - user.bank_debt;
  const earningsPercentage = (totalEarnings / user.total_net_worth) * 100;

  return (
    <div className="flex">
      <StockSideBar />
      <div className="p-4 w-3/4 bg-gray-800 text-white shadow-md max-h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2 text-teal-400">Investing</h1>
        <p className="text-xl font-semibold" style={{ color: lineColor }}>
          $ {user.total_net_worth}
        </p>
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full h-64 sm:h-96">
          <Line data={data} options={options} />
        </div>
        <div className="flex">
          {/* Buying Power Section */}
          <div>
            <div className="grid mt-4">
              <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
                Buying Power
              </h2>
              <div className="text-gray-300">
                <span className="text-lg font-bold text-teal-400">
                  Available:{" "}
                </span>
                <span className="text-green-500 text-xl">
                  ${user.buying_power.toFixed(2)}
                </span>
              </div>
            </div>
            {/* Earnings Section */}
            <div className="grid mt-4">
              <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
                Earnings
              </h2>
              <div className="text-gray-300">
                <span className="text-lg font-bold text-teal-400">
                  Total Earnings:{" "}
                </span>
                <span
                  className={
                    totalEarnings >= 0
                      ? "text-green-400 text-xl"
                      : "text-red-400 text-xl"
                  }
                >
                  ${totalEarnings.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-bold text-teal-400">
                  Earnings Percentage:{" "}
                </span>
                <span
                  className={
                    earningsPercentage >= 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  {earningsPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
            {/* Banking Section */}
            <div className="grid mt-4">
              <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
                Banking
              </h2>
              <div className="text-gray-300">
                <div>
                  <span className="font-bold text-teal-400">Debt: </span>
                  <span className="text-gray-200">
                    ${user.bank_debt.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-teal-400">
                    Available Debt:{" "}
                  </span>
                  <span className="text-gray-200">
                    ${1000000 - user.bank_debt.toFixed(2)}
                  </span>
                </div>
                <div className="mt-4">
                  <input
                    type="number"
                    value={loanAmount}
                    max={maxloan}
                    min={0}
                    onChange={handleLoanAmount}
                    placeholder="Enter loan amount"
                    className="p-2 bg-gray-700 text-white rounded w-1/2"
                  />
                  <button
                    onClick={handleLoanMoney}
                    className="ml-2 p-2 bg-green-500 text-white font-bold rounded shadow-md hover:bg-green-700 active:scale-95 active:bg-green-700 transition-transform duration-150"
                  >
                    Loan Money
                  </button>
                </div>
                <div className="mt-4">
                  <input
                    type="number"
                    value={repayAmount}
                    onChange={handleRepayAmount}
                    placeholder="Enter repay amount"
                    className="p-2 bg-gray-700 text-white rounded w-1/2"
                  />
                  <button
                    onClick={handleRepayMoney}
                    className="ml-2 p-2 bg-red-500 text-white font-bold rounded shadow-md hover:bg-red-700 active:scale-95 active:bg-red-700 transition-transform duration-150"
                  >
                    Repay Debt
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 w-3/4">
            <h2 className="text-2xl font-semibold text-yellow-300 mb-12">
              Holdings
            </h2>
            {user.shares.length === 0 ? (
              <p className="text-gray-500">
                You currently do not hold any shares.
              </p>
            ) : (
              <div className="w-full border-t border-gray-600 mt-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {user.shares
                  .slice()
                  .sort(
                    (a, b) =>
                      b.quantity * b.current_price -
                      a.quantity * a.current_price
                  )
                  .map((share, index) => {
                    const totalValue = share.quantity * share.current_price;
                    const profitLoss =
                      (share.current_price - share.average_price) *
                      share.quantity;

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center py-4 border-b border-gray-600 cursor-pointer hover:bg-gray-800 transition-all duration-150"
                        onClick={() => {
                          window.location.href = `/stocks/${share.stock_id}`;
                        }}
                      >
                        <h3 className="text-lg font-bold text-teal-400 w-1/4">
                          {share.stock_name}
                        </h3>
                        <p className="w-1/4 text-gray-200">
                          <span className="font-bold text-teal-400">
                            Quantity:{" "}
                          </span>
                          {share.quantity}
                        </p>
                        <p className="w-1/4 text-green-500">
                          <span className="font-bold text-teal-400">
                            Total Value:{" "}
                          </span>
                          ${totalValue.toFixed(2)}
                        </p>
                        <p className="w-1/4 text-gray-200">
                          <span className="font-bold text-teal-400">
                            Profit/Loss:{" "}
                          </span>
                          <span
                            className={
                              profitLoss >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            ${profitLoss.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;
