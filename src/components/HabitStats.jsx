import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const HabitStats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/auth/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setStats(data.stats);
    };

    fetchStats();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2>Habit Completion Progress</h2>
      <ResponsiveContainer>
        <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completedDays" fill="#4CAF50" name="Completed Days" />
          <Bar dataKey="totalDays" fill="#E94B3C" name="Total Days" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HabitStats;
