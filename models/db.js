const mongoose = require('mongoose');

function connect(connection_url) {

	
	mongoose
  .connect(connection_url, {
		useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose connected Successfully ..."))
  .catch((err) => console.log(err));
	
}

module.exports = connect;