const pool = require('../database.js');

// Create a new house
// const createHouse = async (req, res) => {
//   const { title, full_address, user_id } = req.body;
//   const sql = `INSERT INTO houses (title, full_address, user_id) 
//                VALUES (?, ?, ?)`;
//   try {
//     await pool.query(sql, [title, full_address, user_id]);
//     res.status(201).send('House added successfully.');
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };


// Controller to add a house and related data
const createHouse = async (req, res) => {
  const {
    title,
    description,
    full_address,
    country,
    state,
    zip,
    location,
    user_id,
    type,
    status,
    size,
    bedrooms,
    bathrooms,
    rooms,
    air_condition,
    wifi,
    garden,
    price,
    before_price_label,
    after_price_label,
  } = req.body;

  try {
    // Insert into houses
    const houseQuery = `
      INSERT INTO houses (title, description, full_address, country, state, zip, location, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [houseResult] = await pool.query(houseQuery, [
      title,
      description,
      full_address,
      country,
      state,
      zip,
      location,
      user_id,
    ]);

    const house_id = houseResult.insertId;

    //Insert into house_details
    const detailsQuery = `
      INSERT INTO house_details (type, status, size, bedrooms, bathrooms, rooms, house_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(detailsQuery, [type, status, size, bedrooms, bathrooms, rooms, house_id]);

    //Insert into amenities
    const amenitiesQuery = `
      INSERT INTO amenities (air_condition, wifi, garden, house_id)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(amenitiesQuery, [air_condition ? 1 : 0, wifi ? 1 : 0, garden ? 1 : 0, house_id]);

    // Insert into prices
    const pricesQuery = `
      INSERT INTO prices (price, before_price_label, after_price_label, house_id)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(pricesQuery, [price, before_price_label, after_price_label, house_id]);

    res.status(201).send({ message: 'House and related data added successfully!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Failed to add house.' });
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

const getPropertyDetails = async (req, res) => {
  try {
    // SQL query to join houses and house_details
    const sql = `
      SELECT 
        h.house_id,
        h.title,
        h.description,
        h.full_address,
        h.country,
        h.state,
        h.zip,
        h.location,
        h.user_id,
        hd.type,
        hd.status,
        hd.size,
        hd.bedrooms,
        hd.bathrooms,
        hd.rooms
      FROM 
        houses h
      INNER JOIN 
        house_details hd
      ON 
        h.house_id = hd.house_id
    `;

    // Execute the query
    const [results] = await pool.query(sql);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching house details:', error.message);
    res.status(500).json({ message: 'Failed to fetch house and house details.' });
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
  getPropertyDetails,
  createHouse,
  findAllHouses,
  findHouseById,
  updateHouseById,
  deleteHouse,
  findHousesByOwner,
};
