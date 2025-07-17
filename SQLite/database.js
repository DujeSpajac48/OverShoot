import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

let dbConn = null;

const initDB = async () => {
  try {
    if (dbConn) {
      return dbConn;
    }

    dbConn = await SQLite.openDatabaseAsync('NewBlock.db');
    console.log('Database opened:', dbConn);


    await dbConn.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        split TEXT NOT NULL,
        duration INTEGER NOT NULL,
        focus TEXT NOT NULL,
        diff TEXT NOT NULL,
        image TEXT,
        createdAt TEXT DEFAULT (CURRENT_TIMESTAMP)
      );
    `);


    await dbConn.execAsync(`
      CREATE TABLE IF NOT EXISTS weeks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blockId INTEGER NOT NULL,
        weekNum INTEGER NOT NULL,
        userId INTEGER,
        createdAt TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);

    // add unique blockId, weekNum i userId
    await dbConn.execAsync(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_week ON weeks (blockId, weekNum, userId);
    `);

    
    await dbConn.execAsync(`
      CREATE TABLE IF NOT EXISTS day (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dayNum INTEGER NOT NULL,
        weekId INTEGER,
        muscleGroup TEXT NOT NULL,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (weekId) REFERENCES weeks(id)
      );
    `);


    await dbConn.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_week_id ON day (weekId);
    `);


    await dbConn.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        setNum INTEGER DEFAULT 1,
        load INTEGER,
        reps INTEGER,
        rpe INTEGER,
        userId INTEGER,
        weekId INTEGER,
        exerNum INTEGER,
        dayId INTEGER,
        createdAt TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (weekId) REFERENCES weeks(id),
        FOREIGN KEY (dayId) REFERENCES day(id)
      );
    `);


    await dbConn.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_user_id ON workouts (userId);
      CREATE INDEX IF NOT EXISTS idx_week_id_workouts ON workouts (weekId);
      CREATE INDEX IF NOT EXISTS idx_day_id ON workouts (dayId);
    `);


    await dbConn.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workoutId INTEGER NOT NULL,
        setNum INTEGER NOT NULL,
        reps INTEGER,
        load INTEGER,
        rpe INTEGER,
        FOREIGN KEY (workoutId) REFERENCES workouts(id)
      );
    `);
    await dbConn.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_workout_id_sets ON workout_sets (workoutId);
    `);

    console.log('All tables created.');
    return dbConn;
  } catch (e) {
    console.error('Greška pri otvaranju baze:', e);
    Alert.alert('Greška', 'Greška pri otvaranju baze');
    return null;
  }
};

export default initDB;
