const pool = require("./pool");

const findUserByUsername = async (username) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows[0];
};

const findUserById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
};

const createUser = async (
  first_name,
  last_name,
  username,
  email,
  password,
  membership_status,
  admin_status,
) => {
  return await pool.query(
    `INSERT INTO users 
  (first_name, last_name, username, email, password, membership_status, admin_status) 
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      first_name,
      last_name,
      username,
      email,
      password,
      membership_status,
      admin_status,
    ],
  );
};

const updateMembershipStatus = async (userId, status) => {
  const { rows } = await pool.query(
    "UPDATE users SET membership_status = $2 WHERE id = $1 RETURNING *",
    [userId, status],
  );
  return rows[0];
};

const createMessage = async (title, text, user_id) => {
  return await pool.query(
    `INSERT INTO messages(title,text,user_id) VALUES($1,$2,$3) RETURNING *`,
    [title, text, user_id],
  );
};

const getAllMessages = async () => {
  const { rows } = await pool.query(`
    SELECT messages.*, users.username
    FROM messages
    JOIN users ON messages.user_id = users.id
    ORDER BY messages.created_at DESC
  `);
  return rows;
};

const updateMessage = async (id, title, text) => {
  const { rows } = await pool.query(
    "UPDATE messages SET title = $2, text = $3 WHERE id = $1 RETURNING *",
    [id, title, text],
  );
  return rows[0];
};

const deletePost = async (id) => {
  const rows = await pool.query("DELETE message WHERE id =$1", [id]);
  return rows.rowCount;
};

const getMessageById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM messages WHERE id = $1", [
    id,
  ]);
  return rows[0];
};

module.exports = {
  findUserById,
  findUserByUsername,
  createUser,
  updateMembershipStatus,
  getAllMessages,
  createMessage,
  updateMessage,
  deletePost,
  getMessageById,
};
