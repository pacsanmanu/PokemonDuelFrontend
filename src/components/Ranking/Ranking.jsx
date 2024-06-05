"use client"

import { useState } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [users, setUsers] = useState([
    { id: 1, name: "Ash Ketchum", wins: 150, rank: 1 },
    { id: 2, name: "Misty", wins: 120, rank: 2 },
    { id: 3, name: "Brock", wins: 100, rank: 3 },
    { id: 4, name: "May", wins: 90, rank: 4 },
    { id: 5, name: "Dawn", wins: 80, rank: 5 },
    { id: 6, name: "Iris", wins: 70, rank: 6 },
    { id: 7, name: "Cilan", wins: 60, rank: 7 },
    { id: 8, name: "Serena", wins: 50, rank: 8 },
    { id: 9, name: "Clemont", wins: 40, rank: 9 },
    { id: 10, name: "Bonnie", wins: 30, rank: 10 },
  ])
  const [sortColumn, setSortColumn] = useState("wins")
  const [sortDirection, setSortDirection] = useState("desc")
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Pokémon Battle Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Check out the top players in our Pokémon battle game!</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("rank")}>
                Rank{" "}
                {sortColumn === "rank" && <span className="ml-1">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                Name{" "}
                {sortColumn === "name" && <span className="ml-1">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>}
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("wins")}>
                Wins{" "}
                {sortColumn === "wins" && <span className="ml-1">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.rank}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell className="text-right">{user.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Button>Update Data</Button>
      </div>
    </div>
  )
}

// http://localhost:3000/users/ranking