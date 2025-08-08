const pool = require('../db');

function getDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (
    !name ||
    !address ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid input. Please provide all fields correctly.' });
  }

  try {
    const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(sql, [name, address, latitude, longitude]);
    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  const latNum = parseFloat(latitude);
  const lonNum = parseFloat(longitude);

  if (isNaN(latNum) || isNaN(lonNum)) {
    return res.status(400).json({ error: 'Please provide valid latitude and longitude as query parameters.' });
  }

  try {
    const [schools] = await pool.query('SELECT * FROM schools');

    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance: getDistance(latNum, lonNum, school.latitude, school.longitude),
    }));

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};