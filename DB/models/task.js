import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: String,
    description: { type: String, required: true },
    status: { type: String, enum: ["toDo", "doing", "done"] },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    assignTo: { type: Schema.Types.ObjectId, ref: "user" },
    isDeleted: { type: Boolean, default: false },
    deadline: { type: Date /*validate: /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/*/ },
  },
  {
    timestamps: true,
  }
);

export let Task = mongoose.model("task", taskSchema);
