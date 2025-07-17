import initDB from './database';


export const getWorkoutsForDay = async (dayId) => {
  try {
    const db = await initDB();
    return await db.getAllAsync(
      `SELECT * FROM workouts WHERE dayId = ? ORDER BY setNum ASC`,
      [dayId]
    );
  } catch (error) {
    console.error('Error fetching workouts for day:', error);
    return [];
  }
};


export const addWorkoutForDay = async (dayId, userId, name, setNum, reps, load, rpe) => {
  try {
    const db = await initDB();
    const result = await db.runAsync(
      `INSERT INTO workouts (name, setNum, reps, load, rpe, userId, dayId) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, setNum, reps, load, rpe, userId, dayId]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding workout for day:', error);
    return null;
  }
};

// Update a workout by unique id
export const updateWorkout = async (workoutId, fields) => {
  try {
    const db = await initDB();
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    if (keys.length === 0) return false;
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    await db.runAsync(
      `UPDATE workouts SET ${setClause} WHERE id = ?`,
      [...values, workoutId]
    );
    return true;
  } catch (error) {
    console.error('Error updating workout:', error);
    return false;
  }
};


export const deleteWorkout = async (workoutId) => {
  try {
    const db = await initDB();
    await db.runAsync(
      `DELETE FROM workouts WHERE id = ?`,
      [workoutId]
    );
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
};


export const getSetsForWorkout = async (workoutId) => {
  try {
    const db = await initDB();
    return await db.getAllAsync(
      `SELECT * FROM workout_sets WHERE workoutId = ? ORDER BY setNum ASC`,
      [workoutId]
    );
  } catch (error) {
    console.error('Error fetching sets for workout:', error);
    return [];
  }
};


export const addSetToWorkout = async (workoutId, setNum, reps, load, rpe) => {
  try {
    const db = await initDB();
    const result = await db.runAsync(
      `INSERT INTO workout_sets (workoutId, setNum, reps, load, rpe) VALUES (?, ?, ?, ?, ?)`,
      [workoutId, setNum, reps, load, rpe]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding set to workout:', error);
    return null;
  }
};


export const updateSet = async (setId, fields) => {
  try {
    const db = await initDB();
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    if (keys.length === 0) return false;
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    await db.runAsync(
      `UPDATE workout_sets SET ${setClause} WHERE id = ?`,
      [...values, setId]
    );
    return true;
  } catch (error) {
    console.error('Error updating set:', error);
    return false;
  }
};


export const deleteSet = async (setId) => {
  try {
    const db = await initDB();
    await db.runAsync(
      `DELETE FROM workout_sets WHERE id = ?`,
      [setId]
    );
    return true;
  } catch (error) {
    console.error('Error deleting set:', error);
    return false;
  }
};

