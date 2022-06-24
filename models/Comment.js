const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  post: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
  },
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	status: {
		type: String,
		required: [true, "Status is required"],
	}
});


const Comment = model("Comment", commentSchema);

module.exports = Comment