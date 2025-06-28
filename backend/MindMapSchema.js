const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  title: String,
  type: String,
  url: String,
});

const nodeSchema = new mongoose.Schema({
  data: {
    background: { type: String, default: null },
    border: { type: String, default: null },
    color: { type: String, default: null },
    description: { type: String, default: null },
    fontSize: { type: String, default: null },
    height: { type: Number, default: 100 },
    links: { type: [linkSchema], default: [] },
    onSelect: { type: String, default: null },
    title: { type: String, default: null },
    value: { type: String, default: null },
    width: { type: Number, default: 150 },
  },
  dragging: { type: Boolean, default: false },
  id: { type: String, required: true },
  measured: {
    height: { type: Number, default: 43 },
    width: { type: Number, default: 59 },
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  selected: { type: Boolean, default: false },
  type: { type: String, required: true },
});

module.exports = mongoose.model('Node', nodeSchema);
