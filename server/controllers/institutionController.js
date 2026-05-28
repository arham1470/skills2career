const Institution = require("../models/Institution");

exports.getInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, institutions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find().sort({ createdAt: -1 });
    res.json({ success: true, institutions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInstitution = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({ success: false, message: "Institution not found" });
    }
    res.json({ success: true, institution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createInstitution = async (req, res) => {
  try {
    const { name, location, type, website, image } = req.body;
    const institution = await Institution.create({ name, location, type, website, image });
    res.status(201).json({ success: true, institution });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateInstitution = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!institution) {
      return res.status(404).json({ success: false, message: "Institution not found" });
    }
    res.json({ success: true, institution });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteInstitution = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!institution) {
      return res.status(404).json({ success: false, message: "Institution not found" });
    }
    res.json({ success: true, message: "Institution deactivated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
