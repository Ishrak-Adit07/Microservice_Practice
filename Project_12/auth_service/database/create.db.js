import pool from "pool";

const createTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE,
        password VARCHAR(100)
      );
    `;

  try {
    const res = await pool.query(query);
    console.log("Table is successfully created");
  } catch (err) {
    console.error("Error creating table", err);
  }
};

createTable();
