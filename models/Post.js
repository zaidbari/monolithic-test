const { Schema, model } = require("mongoose");
const postSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: "Comment",
}],
});


const Post = model("Post", postSchema);

module.exports = Post