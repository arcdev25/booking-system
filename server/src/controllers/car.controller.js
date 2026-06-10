const Car = require("../models/Car");

// GET /api/cars
exports.getCars = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, address, seats, gearshift } = req.query;

    const filter = { isActive: true };
    if (address)   filter.$text   = { $search: address };
    if (seats)     filter.seats   = { $gte: Number(seats) };
    if (gearshift) filter.gearshift = gearshift;

    const cars = await Car.find(filter)
      .populate("author", "firstName lastName displayName avatar")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Car.countDocuments(filter);

    res.json({
      success: true,
      count: cars.length,
      total,
      pages: Math.ceil(total / limit),
      data: cars,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/cars/:id
exports.getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate(
      "author",
      "firstName lastName displayName avatar jobName desc starRating"
    );
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });
    res.json({ success: true, data: car });
  } catch (err) {
    next(err);
  }
};

// POST /api/cars
exports.createCar = async (req, res, next) => {
  try {
    const car = await Car.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, data: car });
  } catch (err) {
    next(err);
  }
};

// PUT /api/cars/:id
exports.updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    if (car.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cars/:id
exports.deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    if (car.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    await car.deleteOne();
    res.json({ success: true, message: "Car deleted" });
  } catch (err) {
    next(err);
  }
};
