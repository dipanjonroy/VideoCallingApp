const { Schema, model } = require("mongoose");

const meetingSchema = new Schema({
  user_id: String,
  meeting_code: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now(), required: true },
});

const Meeting = model("Meeting", meetingSchema);

module.exports = Meeting;
