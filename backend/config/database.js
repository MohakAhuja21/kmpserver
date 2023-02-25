const mongoose = require("mongoose");
// getting value of DB_URI from config.env //
const connectDatabase = () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      // we can use anyName, i have used data
      console.log(`mongoDb connected with server ${data.connection.host}`);
    })
    // .catch((err) => {
    //   console.log(err);
    // });
};

module.exports = connectDatabase;
