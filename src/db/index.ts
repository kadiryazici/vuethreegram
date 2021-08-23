import mongoose from 'mongoose';

export let db: mongoose.Connection;

export async function initDB() {
   await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
   });
   db = mongoose.connection;
   db.on('error', console.error.bind(console, 'connection error:'));
   db.once('open', function () {
      console.log('connected to db.');
   });
}
