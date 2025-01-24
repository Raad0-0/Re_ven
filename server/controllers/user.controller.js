const pool = require('../database');

//kaaj kore
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const sql = `INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)`;
  try {
    await pool.query(sql, [name, email, password, role]);
    res.send('User added successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//kaaj kore
const getAllUsers = async (req, res) => {
  const sql = `SELECT * FROM user`;
  // console.log("run kore");
  try {
    const results = await pool.query(sql);
    res.json(results);
  } catch (err) {
    // console.log('run korse3');
    res.status(500).send(err.message);
  }
};

//kaaj korse
const getUserById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = `SELECT * FROM user WHERE UserId = ?`;
  try {
    const [result] = await pool.query(sql, [id]);
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const sql = `UPDATE user SET name = ?, email = ? WHERE UserId = ?`;
  try {
    await pool.query(sql, [name, email, id]);
    res.send('User updated successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM user WHERE UserId = ?';
  try {
    await pool.query(sql, [id]);
    res.send('User deleted successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
