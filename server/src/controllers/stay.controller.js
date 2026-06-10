const Stay = require("../models/Stay");

// GET /api/stays
exports.getStays = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, address, minPrice, maxPrice } = req.query;

    const filter = { isActive: true };
    if (address) filter.$text = { $search: address };

    const stays = await Stay.find(filter)
      .populate("author", "firstName lastName displayName avatar")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Stay.countDocuments(filter);

    res.json({
      success: true,
      count: stays.length,
      total,
      pages: Math.ceil(total / limit),
      data: stays,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/stays/:id
exports.getStay = async (req, res, next) => {
  try {
    const stay = await Stay.findById(req.params.id).populate(
      "author",
      "firstName lastName displayName avatar jobName desc starRating"
    );
    if (!stay) return res.status(404).json({ success: false, message: "Stay not found" });
    res.json({ success: true, data: stay });
  } catch (err) {
    next(err);
  }
};

// POST /api/stays
exports.createStay = async (req, res, next) => {
  try {
    const stay = await Stay.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, data: stay });
  } catch (err) {
    next(err);
  }
};

// PUT /api/stays/:id
exports.updateStay = async (req, res, next) => {
  try {
    const stay = await Stay.findById(req.params.id);
    if (!stay) return res.status(404).json({ success: false, message: "Stay not found" });

    if (stay.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    const updated = await Stay.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/stays/:id
exports.deleteStay = async (req, res, next) => {
  try {
    const stay = await Stay.findById(req.params.id);
    if (!stay) return res.status(404).json({ success: false, message: "Stay not found" });

    if (stay.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    await stay.deleteOne();
    res.json({ success: true, message: "Stay deleted" });
  } catch (err) {
    next(err);
  }
};
