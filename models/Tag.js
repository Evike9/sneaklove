const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    tag: String
});

const TagModel = mongoose.model("tags", tagSchema);

module.exports = TagModel;


