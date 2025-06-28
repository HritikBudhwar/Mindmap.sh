const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));  
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/profileDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Profile schema and model
const profileSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  profileInfo: { type: String, required: true },
});

const Profile = mongoose.model('Profile', profileSchema);

// Route to handle image upload
app.post('/api/uploadImage', async (req, res) => {
  const { userName, profileInfo } = req.body;

  // Print received data to the console
  console.log('Received userName:', userName);
  console.log('Received profileInfo:', profileInfo);

  try {
    let user = await Profile.findOne({ userName });

    if (!user) {

      user = new Profile({ userName, profileInfo });
      await user.save();
      console.log('New user saved:', user);  
    } else {

      user.profileInfo = profileInfo;
      await user.save();
      console.log('Updated user profile:', user);  
    }

    res.status(200).send({ success: true, message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).send({ success: false, message: 'Error saving profile' });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
