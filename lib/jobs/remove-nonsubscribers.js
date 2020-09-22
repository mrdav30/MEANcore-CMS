import mongoose from 'mongoose';
const Subscribers = mongoose.model('Subscribers');

export default (agenda) => {
  agenda.define('remove-nonsubscribers', async () => {
    await Subscribers.deleteMany({
      optIn: 0,
      subscriptionConfirmExpires: {
        $lt: Date.now()
      }
    });
  });
}
