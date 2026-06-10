const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    displayName: { type: String, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true, minlength: 6, select: false },
    avatar:    { type: String, default: "" },
    bgImage:   { type: String, default: "" },
    jobName:   { type: String, default: "" },
    desc:      { type: String, default: "" },
    href:      { type: String, default: "" },
    starRating:{ type: Number, default: 0 },
    role:      { type: String, enum: ["user", "admin"], default: "user" },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual: full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
