import pool from "pool";

const createTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        payment NUMBER
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
