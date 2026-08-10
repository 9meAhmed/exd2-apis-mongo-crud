require('dotenv').config();
const express = require("express");
var cors = require("cors");
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

router.use('/auth', require('./src/routes/authRoutes'));
router.use('/products', require('./src/routes/productRoutes'));
router.use('/categories', require('./src/routes/categoryRoutes'));

app.use('/', router);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((err) => console.error('❌ Database connection error:', err));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
