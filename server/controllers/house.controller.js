const pool = require('../database.js');

// Create a new house
const createHouse = async (req, res) => {
  const { title, full_address, user_id } = req.body;
  const sql = `INSERT INTO houses (title, full_address, user_id) 
               VALUES (?, ?, ?)`;
  try {
    await pool.query(sql, [title, full_address, user_id]);
    res.status(201).send('House added successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Find all houses
const findAllHouses = async (req, res) => {
  const sql = 'SELECT * FROM houses';
  try {
    const [results] = await pool.query(sql);
    res.send(results);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving houses.',
    });
  }
};

// Find one house by ID
const findHouseById = async (req, res) => {
  const { house_id } = req.params;
  const sql = `SELECT * FROM houses WHERE house_id = ?`;
  try {
    const [results] = await pool.query(sql, [house_id]);
    if (results.length === 0) {
      return res.status(404).send('House not found.');
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update a house by ID
const updateHouseById = async (req, res) => {
  const { house_id } = req.params;
  const updates = req.body;
  const sql = 'UPDATE houses SET ? WHERE house_id = ?';
  try {
    await pool.query(sql, [updates, house_id]);
    res.send({ id, ...updates });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while updating the house.',
    });
  }
};

// Delete a house by ID
const deleteHouse = async (req, res) => {
  const { house_id } = req.params;
  const sql = 'DELETE FROM houses WHERE house_id = ?';
  try {
    await pool.query(sql, [house_id]);
    res.send('House deleted successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Find all houses owned by a specific user
const findHousesByOwner = async (req, res) => {
  const { user_id } = req.params;
  const sql = 'SELECT * FROM houses WHERE user_id = ?';
  try {
    const [results] = await pool.query(sql, [user_id]);
    res.send(results);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving houses for the user.',
    });
  }
};

module.exports = {
  createHouse,
  findAllHouses,
  findHouseById,
  updateHouseById,
  deleteHouse,
  findHousesByOwner,
};
