const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://anaismateusc:kZLShfiGM6j8o8mu@memes.aweyd4e.mongodb.net/memes?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Mongoose model for memes
const Meme = mongoose.model('Meme', {
    url: String,
    favorites: {
        type: Number,
        default: 0,
    },
});

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  const memes = await Meme.find();
  res.render('index', { memes }); // Pass memes data to the template
});

// Handle meme uploads
app.post('/upload', upload.single('meme'), async (req, res) => {
  const meme = new Meme({
      url: `/uploads/${req.file.filename}`,
      favorites: 0
});

  await meme.save();
  res.redirect('/');
});

// Handle favorites
app.put('/favorite', async (req, res) => {
  try {
      const clientUrl = req.body.url;
      const dbUrl = `/uploads/${clientUrl}`;

      const updatedMeme = await Meme.findOneAndUpdate({ url: dbUrl }, { $inc: { favorites: 1 } }, { new: true });

      if (!updatedMeme) {
          return res.status(404).send('Meme not found');
      }

      res.status(200).json({ favorites: updatedMeme.favorites });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// handle deletes
app.delete('/delete', async (req, res) => {
  try {
      const clientUrl = req.body.url;
      const dbUrl = `/uploads/${clientUrl}`;

      const deletedMeme = await Meme.findOneAndDelete({ url: dbUrl }).exec();

      if (!deletedMeme) {
          return res.status(404).send('Meme not found');
      }

      // You might want to delete the file from the server too. Add this if needed:
      // const filePath = path.join(__dirname, 'public', 'uploads', clientUrl);
      // fs.unlinkSync(filePath);

      res.status(200).send('Meme deleted successfully');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});