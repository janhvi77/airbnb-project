const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
});

// ✅ Apply plugin to schema
userSchema.plugin(passportLocalMongoose);

// ✅ Create model
const User = mongoose.model("User", userSchema);

// ✅ Export model
module.exports = User;