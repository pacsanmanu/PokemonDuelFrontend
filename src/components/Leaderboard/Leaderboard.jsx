"use client";

import { useState, useEffect } from "react";
import './Leaderboard.css';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [sortColumn, setSortColumn] = useState("longestWinStreak");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.BACKEND_URL}/users/ranking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Pokémon Battle Leaderboard</h1>
        <p>Check out the top players in our Pokémon battle game!</p>
      </div>
      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th onClick={() => handleSort("username")}>
                Name {sortColumn === "username" && <span>{sortDirection === "asc" ? "▲" : "▼"}</span>}
              </th>
              <th onClick={() => handleSort("longestWinStreak")}>
                Longest Win Streak {sortColumn === "longestWinStreak" && <span>{sortDirection === "asc" ? "▲" : "▼"}</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, index) => (
              <tr key={user.username}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.longestWinStreak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="leaderboard-button-container">
        <button className="leaderboard-button" onClick={fetchUsers}>Update Data</button>
      </div>
    </div>
  );
}
