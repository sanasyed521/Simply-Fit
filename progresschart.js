import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressChart = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [mealData, setMealData] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mealResponse = await axios.get(`/api/meals/?time_range=${timeRange}`, {
          withCredentials: true,
        });
        const workoutResponse = await axios.get(`/api/workouts/?time_range=${timeRange}`, {
          withCredentials: true,
        });
        setMealData(mealResponse.data);
        setWorkoutData(workoutResponse.data);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);

  const handleChange = (event, newValue) => {
    setTimeRange(newValue);
  };

  const processChartData = (data, type) => {
    if (!data || data.length === 0) return { labels: [], datasets: [] };

    const labels = data.map(item => 
      type === 'meals' ? item.date : `${item.workout_type} (${item.date})`
    );
    const values = data.map(item => 
      type === 'meals' ? item.calories : item.calories_burned
    );
    const backgroundColor = type === 'meals' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 159, 64, 0.6)';

    return {
      labels,
      datasets: [
        {
          label: type === 'meals' ? 'Calories Consumed' : 'Calories Burned',
          data: values,
          backgroundColor,
          borderColor: type === 'meals' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const mealChartData = processChartData(mealData, 'meals');
  const workoutChartData = processChartData(workoutData, 'workouts');

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: timeRange === 'week' ? 'Weekly Progress' : 
              timeRange === 'month' ? 'Monthly Progress' : 'Daily Progress',
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Progress
      </Typography>
      <Tabs value={timeRange} onChange={handleChange} centered>
        <Tab label="Daily" value="day" />
        <Tab label="Weekly" value="week" />
        <Tab label="Monthly" value="month" />
      </Tabs>
      {loading ? (
        <Typography>Loading data...</Typography>
      ) : (
        <>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Nutrition
            </Typography>
            <Bar data={mealChartData} options={options} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Workouts
            </Typography>
            <Bar data={workoutChartData} options={options} />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ProgressChart;