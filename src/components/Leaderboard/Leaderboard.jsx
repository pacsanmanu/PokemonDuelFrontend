"use client";

import { useState, useEffect } from "react";

export default function Component() {
  const [users, setUsers] = useState([]);
  const [sortColumn, setSortColumn] = useState("longestWinStreak");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/users/ranking", {
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
    <div className="container">
      <div className="header">
        <h1>Pokémon Battle Leaderboard</h1>
        <p>Check out the top players in our Pokémon battle game!</p>
      </div>
      <div className="table-container">
        <table>
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
      <div className="button-container">
        <button onClick={fetchUsers}>Update Data</button>
      </div>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .header p {
          color: #666;
        }
        .table-container {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th,
        td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          cursor: pointer;
          background-color: #f9f9f9;
        }
        th span {
          margin-left: 5px;
        }
        .button-container {
          text-align: right;
        }
        button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
