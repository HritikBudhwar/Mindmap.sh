const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const os = require('os');
const fs = require('fs');
const path = require('path'); 

const app = express();
const { userMapNode1 , userMapEdge1 }  = require('./defaultMapData1');
const {userMapNode2 , userMapEdge2} = require('./deafaultMapData2')
// Middleware
app.use(cors());
app.use(express.json());

console.log(userMapNode1);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/MMDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

const userProfileSchema = new mongoose.Schema({
  username: String,
  profilePic: String, 
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

const User = require("./User_info");
const Self = require("./Self_Profile");
const Note = require("./User_Notes");

// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username, password });

//     if (user) {

//       res.json({ 
//         username: user.username,
//         success: true, 
//         message: 'UserPresent', 
//         exist: true,
//         cards: user.cards 
//       });
//     } else {
//       /*const newUser = new User({ username, password, cards: [{ title: "html", description: "html" }] , userMapNode : [] , userMapEdge : []});
//       await newUser.save();*/
//       res.status(401).json({ success: false, message: 'Invalid username or password', exist: false });
//     }
//   } catch (error) {

//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {

    const user = await User.findOne({ username });

    if (!user) {

      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
        exist: false,
      });
    }

   //Bcrypt mathching
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Password mismatch
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
        exist: false,
      });
    }


    res.json({
      username: user.username,
      success: true,
      message: 'UserPresent',
      exist: true,
      cards: user.cards,
    });

  } catch (error) {
    console.error('Error during login:', error);


    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(os.tmpdir(), 'uploads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });



app.post('/api/uploadProfile', upload.single('profilePic'), async (req, res) => {
  const { username } = req.body;
  const profilePic = req.file ? req.file.path : null;

  try {

    const existingUser = await UserProfile.findOne({ username });
    const selfuser = await Self.findOne({usernameself : username});
    if (existingUser && selfuser) {

      existingUser.profilePic = profilePic;
      await existingUser.save();
      selfuser.selfProfile = profilePic;
      await selfuser.save();
      res.json({ success: true, message: 'Profile updated successfully' });
    } else {

      const newUserProfile = new UserProfile({ username, profilePic });
      await newUserProfile.save();
      selfuser.selfProfile = profilePic;
      await selfuser.save();
      res.json({ success: true, message: 'Profile saved successfully' });
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ success: false, message: 'Error saving profile' });
  }
});



app.get('/api/getProfile/:username', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ username: req.params.username });
    if (!profile) {
      return res.status(404).json({ username: req.params.username, profilePicUrl: "", message: 'Profile not found', status: false });
    }
    res.json({
      username: profile.username,
      profilePicUrl: `/uploads/${path.basename(profile.profilePic)}`,
      message: 'ProfileFound',
      status: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.use('/uploads', express.static(path.join(os.tmpdir(), 'uploads')));


app.post('/api/cards/add', async (req, res) => {
  const { username, card } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      
      const existingCard = user.cards.find((existing) => existing.title === card.title);
      
      if (existingCard) {
        return res.json({ success: false, message: 'Card with this title already exists' });
      }

      user.cards.push(card); 
      await user.save();
      res.json({ success: true, cards: user.cards });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Route to load cards
app.post('/api/cards/load', async (req, res) => {
  const { username } = req.body; 

  try {
    const user = await User.findOne({ username });
    if (user) {
      res.json({ success: true, cards: user.cards });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Route to delete cards
app.post('/api/cards/delete', async (req, res) => {
  const { username, cards } = req.body; 

  try {
    const user = await User.findOne({ username });
    if (user) {
      user.cards = cards; 
      await user.save(); 
      res.json({ success: true, cards: user.cards }); 
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

{/*Instant Delte of User Card*/}
app.delete('/api/Instanst/delete', async (req, res) => {
  const { username, cards } = req.body; 

  try {
    const user = await User.findOne({ username });

    if (user) {
     
      user.cards = user.cards.filter(card => !cards.includes(card)); 
      await user.save(); app.delete('/api/cards/delete', async (req, res) => {
  const { username, cards } = req.body; 

  try {
    const user = await User.findOne({ username });

    if (user) {
      
      user.cards = user.cards.filter(card => !cards.includes(card)); 
      await user.save(); 

      res.json({ success: true, cards: user.cards });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


      res.json({ success: true, cards: user.cards });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/cards/export', async (req, res) => {
  const { self, cardTitle, newCard } = req.body;

  // console.log("In Exports");
  // console.log("Yay Printing my self", self);
  try {
    const user1 = await User.findOne({ username: self }); 
    // console.log("Printing self  ===================="); 
    // console.log(user1);

    if (!user1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log("Printing Cards ======================");
    const card = user1.cards.find((c) => c.title === cardTitle);
    // console.log("Printing Card =============");
    // console.log(card);

    if (!card) {
      return res.status(404).json({ message: 'Card not found for user1', card: null });
    }


    card.userMapNode = newCard.userMapNode;
    card.userMapEdge = newCard.userMapEdge;
    // console.log("printnig nodes : ======");
    card.userMapNode.forEach(node => {
      node.data.status = 'pending'
    });
    await user1.save(); 
    
    res.status(200).json({ message: 'Card exported successfully', card: card });
  } catch (error) {
    console.error('Error exporting card:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/cards/Import', async (req, res) => {
  const { username,self ,cardTitle } = req.body;

  try {

    const user = await User.findOne({ username : username });
    // console.log("Printing the cards")
    

    // console.log("======================================")
    if (!user) {

      return res.status(404).json({ message: 'User not found', card: null });
    }


    const newCard = user.cards.find((c) => c.title === cardTitle);
    // console.log("printing the card : ")
    // console.log(newCard)
    if (!newCard) {

      return res.status(404).json({ message: 'Card not found', card: null });
    }
    else{

    res.status(200).json({ message: 'Card found', card : newCard});
    }

  } catch (error) {
    console.error('Error during import:', error);

    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/cards/update', async (req, res) => {
  const { username, cards } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

   
    const updatedCards = cards.map((newCard, index) => {
    
      if (user.cards[index]) {
        return {
          ...newCard,
          userMapNode: user.cards[index].userMapNode || [],
          userMapEdge: user.cards[index].userMapEdge || []
        };
      }
      return newCard;
    });

    user.cards = updatedCards;
    await user.save();
    
    res.json({ success: true, cards: user.cards });
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


const bcrypt = require('bcrypt');

app.post('/api/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
      console.log("Checking in username");


    }
    else{
      const checkEmail = await Self.findOne({email:email});

      if(checkEmail){
        return res.status(400).json({ success: false, message: 'EmailAlready in use' });
        console.log("Email Entered : " , email , "User found : " , checkEmail.email)
      
      }

      
    }


    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const newUser = new User({
      username,
      password: hashedPassword, 
      cards: [
        { title: "FrontEnd", description: "DefaultFrontEndMap", userMapNode: userMapNode1, userMapEdge: userMapEdge1 },
        { title: "BackEnd", description: "DefaultBackEndMap", userMapNode: userMapNode2, userMapEdge: userMapEdge2 }
      ],
    });

    await newUser.save();


    const newSelf = new Self({
      usernameself: username,
      email,
      imports: 0,
      exports: 0,
      selfdescription: 'No description available',
    });
    await newSelf.save();

    const newUserNote = new Note({ usernameNote: username, note: "" });
    await newUserNote.save();

    res.json({ success: true, message: 'Account created successfully' });

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});


app.post('/api/selfInfo', async (req, res) => {
  const { username } = req.body;

  try {
    const existingUser = await Self.findOne({ usernameself: username });

    if (existingUser) {
      // console.log('User is present:', existingUser);


      return res.status(200).send({
        message: 'User data retrieved successfully',
        email: existingUser.email,
        selfdescription: existingUser.selfdescription,
        imports: existingUser.imports,
        exports: existingUser.exports,
        createdAt: existingUser.createdAt,
        selfProfile : `/uploads/${path.basename(existingUser.selfProfile)}`
      });
    } else {
      return res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({ message: 'Error fetching user data' });
  }
});


{/*Instant Update of User Card*/}
app.put('/api/Instant/update', async (req, res) => {
  const { username, cards } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    
    const updatedCards = cards.map((newCard, index) => {
      if (user.cards[index]) {

        return {
          ...newCard,
          userMapNode: user.cards[index].userMapNode || [],
          userMapEdge: user.cards[index].userMapEdge || []
        };
      }

      return newCard;
    });

    user.cards = updatedCards;
    await user.save();  

    res.json({ success: true, cards: user.cards });
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.post('/api/updateimportexport' , async (req, res) =>{
  const {user1 , user2} = req.body;
  // console.log(user1,user2)
  const exist1 = await Self.findOne({usernameself : user1})
  const exist2 = await Self.findOne({usernameself : user2})
  // console.log(exist1 , exist2)
  try{
    if(!exist1 || !exist2){
      return res.status(500).send({ message: 'Error fetching user data' });
    }
    else{
      exist1.imports += 1;
      exist2.exports +=1;
      await exist1.save()
      await exist2.save();

      res.status(200).json({ message: 'Good' });

    }
  }
  catch(error){
    res.status(404).json({ message: 'Internal server error' });
  }
});
app.post('/api/saveNewDesc', async (req, res) => {
  const { username, desc } = req.body;

  try {

      const existing = await Self.findOne({ usernameself: username });

      if (!existing) {
          return res.status(404).send({ message: 'User not found' });
      }


      existing.selfdescription = desc;


      await existing.save();


      res.status(200).send({ message: 'User description updated successfully' });

  } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
  }
});
{/*Please organise the code*/}

app.post('/api/saveMindMap', async (req, res) => {
  const { userName, cardTitle, nodes, edges } = req.body; 
  // console.log("Incoming data:", req.body);

  try {

    const user = await User.findOne({ username: userName });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    const card = user.cards.find(card => card.title === cardTitle);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    card.userMapNode = nodes; 
    card.userMapEdge = edges;
    await user.save(); 

    // console.log("Updated userMapNode:", card.userMapNode);
    res.json({ success: true, cards: user.cards });
  } catch (error) {
    console.error("Error updating mind map:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.post('/api/loadMindMap', async (req, res) => {
  const { userName, cardTitle } = req.body; 
  try {
    const user = await User.findOne({ username: userName });
    
    if (user) {
      const card = user.cards.find(card => card.title === cardTitle);
      if (card) {
        res.json({
          success: true,
          nodes: card.userMapNode, 
          edges: card.userMapEdge, 
        });
      } else {
        res.status(404).json({ success: false, message: 'Card not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/userSearch', async (req, res) => {
  const { username } = req.body; 

  try {
    const user = await User.findOne({ username });  

    if (user) {
      res.status(200).json({ success: true, message: 'User Found', exist: true, cards: user.cards });
    } else {
      res.status(404).json({ success: false, message: 'User not found', exist: false, cards: null });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', exist: false, cards: null });
  }
});


app.get('/api/LoadNotes', async (req, res) => {
  const { usernameNote} = req.query; 
  console.log("In LoadNotes")
  if (!usernameNote) {
    return res.status(400).json({ success: false, message: 'usernameNote is required' });
  }
  
  try {

    const exist = await Note.findOne({ usernameNote });

    if (exist) {
      return res.status(200).json({
        success: true,
        message: 'User Found',
        userNotes: exist.note,
      });
    } else {
      //Lol I forgot this part 
      const newuserNote = new Note({ usernameNote, note :  '' });
      await newuserNote.save();

      return res.status(201).json({
        success: true,
        message: 'User Not Found, created new entry',
        userNotes: newuserNote.note,
      });
    }
  } catch (error) {
    console.error('Error loading notes:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
    });
  }
});




app.post('/api/updateNotes', async (req, res) => {
  const { usernameNote, newNote } = req.body; 

  console.log(newNote);

  try {
    const existNote = await Note.findOne({ usernameNote }); 

    if (existNote) {
     
      existNote.note = newNote;
      await existNote.save(); 

      return res.status(200).json({
        success: true,
        message: 'Note updated successfully',
      });
    } else {
      
      return res.status(404).json({
        success: false,
        message: 'Note not found for this user',
      });
    }
  } catch (error) {
    console.log("Error in notes:", error);

    
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the note',
    });
  }
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
