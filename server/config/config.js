import mongoose from 'mongoose'

const server = 'localhost:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'chat';      // REPLACE WITH YOUR DB NAME

//Mongoose Connection
mongoose.connect(`mongodb://${server}/${database}`,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  },
  (err, db) => {

    if (err) console.log("mongoose Error ", err);
    else console.log('Connected to mongodb')

  })

//Use native promises for mongoose as its promise library is depreciated
mongoose.Promise = global.Promise;

export default mongoose
