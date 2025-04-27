import AssessmentFramework from "../models/assessmentFrameworkModel.js";

export const createAssessmentFramework = async (req, res) => {
  try {
    const { title, scoringScale, criteria, total } = req.body;
    const createdBy = req.userId;

    if (!title || !scoringScale || !criteria || !total)
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });

    for (const item of scoringScale) {
      if (!item.score || !item.description)
        return res.status(400).json({
          success: false,
          message: "Score and description is required",
        });
    }

    const assessmentFramework = new AssessmentFramework({
      title,
      scoringScale,
      criteria,
      createdBy,
      total,
    });
    await assessmentFramework.save();

    res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      assessmentFramework,
    });
  } catch (error) {
    console.error("Error creating assessment framework:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAssessmentFramework = async (req, res) => {
  try {
    const user = req.userId;
    const assessmenTframeworkCreatedByCurrentUser =
      await AssessmentFramework.find({ createdBy: user }).sort({
        createdAt: -1,
      });

    if (!assessmenTframeworkCreatedByCurrentUser)
      return res.status(404).json({ message: "No assessment framework found" });

    res.status(200).json(assessmenTframeworkCreatedByCurrentUser);
  } catch (error) {}
};

export const getOneAssessmentFramework = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;

    const assessmentFramework = await AssessmentFramework.findById(id);

    if (!assessmentFramework)
      return res
        .status(404)
        .json({ message: false, message: "No assessment framework Found" });

    if (user != assessmentFramework.createdBy.toString())
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this assessment framework",
      });

    res.status(200).json({ success: true, assessmentFramework });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAssessmentFramework = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;
    const updates = req.body;

    const assessmentFramework = await AssessmentFramework.findById(id);

    if (!assessmentFramework)
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });

    if (assessmentFramework.createdBy.toString() != user)
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this assessment framework",
      });

    const updatedFramework = await AssessmentFramework.findByIdAndUpdate(
      id,
      updates,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      }
    );

    res.status(200).json({
      success: true,
      message: "Asessment updated successfuly",
      updatedFramework,
    });
  } catch (error) {
    console.error("Error updating assessment framework:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteAssessmentFramework = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;

    const ass = await AssessmentFramework.findByIdAndDelete(id);

    if (!ass)
      return res
        .status(404)
        .json({ success: false, message: "Asessment framework not found" });

    if (ass.createdBy.toString() != user)
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this assessment framework",
      });

    res
      .status(200)
      .json({ success: true, message: "Deleted successfully", ass });
  } catch (error) {}
};
