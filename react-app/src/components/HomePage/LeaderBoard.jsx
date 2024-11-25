import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkAuthenticate } from "../../redux/session";

function Leaderboard() {
  const dispatch = useDispatch();
  const [leaderboard, setLeaderboard] = useState([]); // 用于排名
  const [allUsers, setAllUsers] = useState([]); // 用于用户信息
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.session.user);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/users/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      setLeaderboard(data.users);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }
      const data = await response.json();
      setAllUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    dispatch(thunkAuthenticate());
    fetchLeaderboard();
    fetchAllUsers();
    setLoading(false)

    const intervalId = setInterval(fetchLeaderboard, 3000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const getCurrentUserRank = () => {
    if (!currentUser || leaderboard.length === 0) return "N/A";
    const user = leaderboard.find((u) => u.id === currentUser.id);
    return user ? user.rank : "N/A";
  };

  const usersWithRank = allUsers.map((user) => {
    const leaderboardEntry = leaderboard.find((entry) => entry.id === user.id);
    return {
      ...user,
      rank: leaderboardEntry ? leaderboardEntry.rank : "N/A",
    };
  });

  return (
    <div className="p-8 bg-gray-900 text-white h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        <div className="text-gray-300">
          {currentUser
            ? `Your Rank: ${getCurrentUserRank()}`
            : "N/A"}
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : usersWithRank.length > 0 ? (
        <div className="overflow-auto max-h-[70vh] border border-gray-700 rounded-lg">
          <table className="min-w-full table-auto bg-gray-800 text-gray-200">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="p-4 text-left font-semibold">Rank</th>
                <th className="p-4 text-left font-semibold">First Name</th>
                <th className="p-4 text-left font-semibold">Net Worth</th>
              </tr>
            </thead>
            <tbody>
              {usersWithRank.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="p-4">{user.rank}</td>
                  <td className="p-4">{user.first_name}</td>
                  <td className="p-4">
                    ${user.total_net_worth ? user.total_net_worth.toFixed(2) : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
}

export default Leaderboard;
