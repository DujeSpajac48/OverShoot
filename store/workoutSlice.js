import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workouts: [],
};

export const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    addWorkout: (state, action) => {
      state.workouts.push(action.payload);
    }
  }
});

export const { addWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;