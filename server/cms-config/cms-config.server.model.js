import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cmsConfigSchema = new Schema({
  defaultUrlStructure: {
    type: String,
    trim: true
  }
}, {
  strict: false
});

mongoose.model('CMSConfig', cmsConfigSchema);
