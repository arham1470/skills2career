const Course = require("../models/Course");
const Institution = require("../models/Institution");

exports.getCourses = async (req, res) => {
  try {
    const { institution, educationLevel } = req.query;
    const filter = { isActive: true };
    if (institution) filter.institution = institution;
    if (educationLevel) filter.educationLevel = educationLevel;

    const courses = await Course.find(filter)
      .populate("institution", "name location image")
      .sort({ name: 1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("institution", "name location image")
      .sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("institution", "name location image");
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, institution, educationLevel, description, duration, requirements, entryType, acceptedFields, acceptedQualificationTypes, acceptedQualificationNames } = req.body;
    
    const institutionExists = await Institution.findById(institution);
    if (!institutionExists) {
      return res.status(404).json({ success: false, message: "Institution not found" });
    }

    const course = await Course.create({
      name,
      institution,
      educationLevel,
      description,
      duration,
      requirements,
      entryType,
      acceptedFields,
      acceptedQualificationTypes,
      acceptedQualificationNames,
    });

    const populatedCourse = await Course.findById(course._id).populate("institution", "name location image");
    res.status(201).json({ success: true, course: populatedCourse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("institution", "name location image");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, message: "Course deactivated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
