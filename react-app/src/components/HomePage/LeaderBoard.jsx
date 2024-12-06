import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkAuthenticate } from "../../redux/session";

function Leaderboard() {
  const dispatch = useDispatch();
  const [allUsers, setAllUsers] = useState([]); // 用于用户信息
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.session.user);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }
      const data = await response.json();
      setAllUsers(data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(thunkAuthenticate());
    fetchAllUsers();
  }, [dispatch]);

  const getCurrentUserRank = () => {
    if (!currentUser || allUsers.length === 0) return "N/A";
    const sortedUsers = [...allUsers].sort(
      (a, b) => 
        (b.total_net_worth - b.bank_debt) - (a.total_net_worth - a.bank_debt)
    );
    const userIndex = sortedUsers.findIndex((user) => user.id === currentUser.id);
    return userIndex !== -1 ? userIndex + 1 : "N/A";
  };
  const sortedUsersWithRank = [...allUsers]
    .sort((a, b) => 
      (b.total_net_worth - b.bank_debt) - (a.total_net_worth - a.bank_debt)
    )
    .map((user, index) => ({
      ...user,
      adjusted_net_worth: user.total_net_worth - user.bank_debt,
      rank: index + 1,
    }));

  return (
    <div className="p-8 bg-gray-900 text-white h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        <div className="text-gray-300">
          {currentUser ? `Your Rank: ${getCurrentUserRank()}` : "N/A"}
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : sortedUsersWithRank.length > 0 ? (
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
              {sortedUsersWithRank.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="p-4">{user.rank}</td>
                  <td className="p-4">{user.first_name}</td>
                  <td className="p-4">
                    ${user.total_net_worth ? (user.total_net_worth-user.bank_debt).toFixed(2) : "N/A"}
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
