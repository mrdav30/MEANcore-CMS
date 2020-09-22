import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const subscribersSchema = new Schema({
  email: {
    type: String,
    trim: true
  },
  optIn: {
    type: Number
  },
  optInDate: {
    type: String
  },
  /* For subscription confirmation */
  subscriptionConfirmToken: {
    type: String
  },
  subscriptionConfirmExpires: {
    type: Date
  }
}, {
  strict: false
});
subscribersSchema.index({
  email: 1
});

mongoose.model('Subscribers', subscribersSchema);
