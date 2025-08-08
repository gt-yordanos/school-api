require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res)=>{
  res.send("Welcome to Educase India School Management System")
})

app.use(bodyParser.json());
app.use('/', schoolRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});