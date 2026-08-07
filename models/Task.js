const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, unique: true, required: true, trim: true 
    },
    email: {
      type: String, unique: true, required: true, trim: true
    },
    passwordHash: {
      type: String, required: true
    }
  },
  {
    timestamps: true
  }
);

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, index: true, required: true, ref: "User"
    },
    title: {
      type: String, required: true, trim: true, minlength: 1
    },
status: {
      type: String, required: true,
      enum: ["todo", "doing", "done"]
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = { User, Task };
