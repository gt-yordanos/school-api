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

  // No manual validation needed here — handled by express-validator middleware

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
  const latNum = parseFloat(req.query.latitude);
  const lonNum = parseFloat(req.query.longitude);

  // No manual validation needed here — handled by express-validator middleware

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