const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  data: {
    background: { type: String, default: null },
    border: { type: String, default: null },
    color: { type: String, default: null },
    description: { type: String, default: null },
    fontSize: { type: String, default: null },
    height: { type: Number, default: 100 },
    width: { type: Number, default: 150 },
    value: { type: String, default: null },
    status : {type: String , default : null}

  },
  links: [{
    title: String,
    type: String,
    url: String
  }],
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  id: { type: String, required: true }, 
  type: { type: String, default: 'defaultType' }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cards: [
    {
      title: String,
      description: String,
      userMapNode:[], 
      userMapEdge:[]
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
