require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
username VARCHAR(50) UNIQUE NOT NULL,
email VARCHAR(100)UNIQUE NOT NULL,
password VARCHAR(250)  NOT NULL,
membership_status BOOLEAN DEFAULT false,
admin_status BOOLEAN DEFAULT false,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages(
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(50) NOT NULL,
text TEXT NOT NULL,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const seed = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("starting...");
    await client.connect();
    await client.query(SQL);
    console.log("seeding finished.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
};

seed();
