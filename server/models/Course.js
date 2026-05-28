const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: [true, "Institution is required"],
    },
    educationLevel: {
      type: String,
      enum: ["O/L", "A/L", "HND", "Bachelor", "Diploma"],
      required: [true, "Education level is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    // Requirements based on education level
    requirements: {
      // For O/L level courses
      olPasses: {
        type: Number,
        min: 0,
        max: 9,
        default: null,
      },
      olMandatorySubjects: {
        type: [String],
        default: [],
      },
      // For A/L level courses
      alStream: {
        type: String,
        enum: ["Arts", "Commerce", "Science", "Technology", "Any", null],
        default: null,
      },
      alPasses: {
        type: Number,
        min: 0,
        max: 4,
        default: null,
      },
      // For HND / Bachelor / Diploma
      gpa: {
        type: Number,
        min: 0,
        max: 4,
        default: null,
      },
      requiredField: {
        type: String,
        enum: [
          "Any",
          "IT / Computing",
          "Business / Management",
          "Engineering",
          "Science",
          "Arts / Humanities",
          "Law",
          "Medicine / Health Sciences",
          "Hospitality / Tourism",
        ],
        default: "Any",
      },
      // General requirements
      otherRequirements: {
        type: String,
        trim: true,
        default: "",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
