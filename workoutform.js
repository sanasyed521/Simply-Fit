import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, MenuItem, Paper } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const workoutTypes = [
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Strength Training' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'balance', label: 'Balance' },
];

const intensityLevels = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const WorkoutForm = ({ onWorkoutAdded }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    workout_type: 'cardio',
    duration: '',
    intensity: 'medium',
    calories_burned: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/workouts/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      onWorkoutAdded(response.data);
      setFormData({
        workout_type: 'cardio',
        duration: '',
        intensity: 'medium',
        calories_burned: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Log a Workout
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Workout Type"
              name="workout_type"
              value={formData.workout_type}
              onChange={handleChange}
              required
            >
              {workoutTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Intensity"
              name="intensity"
              value={formData.intensity}
              onChange={handleChange}
              required
            >
              {intensityLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Calories Burned"
              name="calories_burned"
              type="number"
              value={formData.calories_burned}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Log Workout
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default WorkoutForm;