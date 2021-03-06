const { Schema, model } = require("mongoose");

const GamesSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  score: Number,
  otherScore: Number,
});

const GamesModel = model("games", GamesSchema);
module.exports = GamesModel;
