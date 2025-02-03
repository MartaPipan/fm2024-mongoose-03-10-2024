const mongoose = require("mongoose");
const { Schema } = mongoose;

const emotionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        "Happiness",
        "Sadness",
        "Love",
        "Joy",
        "Nervousness",
        "Anger",
        "Surprise",
        "Disgust",
      ],
        },
    messageId: {
      required: true,
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Emotion = mongoose.model("Emotion", emotionSchema);

module.exports = Emotion;
