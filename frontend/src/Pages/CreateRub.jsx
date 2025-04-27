import { PlusSquare, SquarePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CreateRub = () => {
  const navigate = useNavigate();

  const { createAssessment, isCreating } = assessmentFrameworkStore();

  const [criteriaFields, setCriteriaFields] = useState([
    { criteria: "", descriptor: [] },
  ]);
  const [scale, setScale] = useState([{ score: 0, description: "" }]);
  const [Title, setTitle] = useState({ title: "" });
  const [activeTab, setActiveTab] = useState("1");

  const handleAddCriteria = () => {
    const descriptorNum = Array(scale.length);

    setCriteriaFields([
      ...criteriaFields,
      { criteria: "", descriptor: descriptorNum },
    ]);
  };

  const handleDeleteCriteria = (index) => {
    setCriteriaFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCriteria = (index, value) => {
    setCriteriaFields((prev) =>
      prev.map((item, i) => (i === index ? { ...item, criteria: value } : item))
    );
  };

  const handleDescriptorChange = (criteriaIndex, descriptorIndex, value) => {
    const updatedDesField = [...criteriaFields];
    updatedDesField[criteriaIndex].descriptor[descriptorIndex] = value;
    setCriteriaFields(updatedDesField);
  };

  const handleFields = () => {
    setScale([...scale, { score: 0, description: "" }]);
  };

  const handleDelete = (index) => {
    const newScale = scale.filter((_, i) => i !== index);
    setScale(newScale);

    setCriteriaFields((prevFields) =>
      prevFields.map((criteria) => ({
        ...criteria,
        descriptor: criteria.descriptor.filter((_, i) => i !== index),
      }))
    );
  };

  const calculateTotal = () => {
    const maxScore = scale.length
      ? Math.max(...scale.map((item) => item.score))
      : 0;
    return criteriaFields.length * maxScore;
  };

  const handleChange = (index, key, value) => {
    setScale((prevScale) =>
      prevScale.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };

  const validateForm = () => {
    const isScaleValid = scale.every(
      (field) => field.score.trim() && field.description.trim()
    );

    const isCriteriaValid = criteriaFields.every((criteria) =>
      criteria.criteria.trim()
    );

    const areDescriptorsValid = criteriaFields.every((criteria) =>
      criteria.descriptor.every((desc) => desc.trim())
    );

    if (
      !isScaleValid ||
      !Title.title.trim() ||
      !criteriaFields ||
      !scale ||
      !isCriteriaValid ||
      !areDescriptorsValid
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const rubricData = {
        title: Title.title.trim(),
        scoringScale: scale,
        criteria: criteriaFields,
        total: calculateTotal(),
      };

      console.log("Submitting rubric data:", rubricData);
      await createAssessment(rubricData);

      console.log("Rubric created successfully");
      navigate("/assessment-framework", { replace: true });
    } catch (error) {
      console.error("Rubric submission failed:", error);
      toast.error("Failed to create rubric. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/assessment-framework", { replace: true });
  };

  return (
    <div className="ml-10 lg:ml-64 h-screen overflow-auto mt-0">
      <div className="mt-20">
        <div className="grid place-items-center">
          <h1 className="text-2xl font-bold mb-8">Create Rubric</h1>
        </div>
        <div className="flex justify-between mb-8">
          <button
            className={`w-1/3 text-center pb-2 ${
              activeTab === "1" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("1")}
          >
            Performance Level
          </button>
          <button
            className={`w-1/3 text-center pb-2 ${
              activeTab === "2" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("2")}
          >
            Criteria
          </button>
          <button
            className={`w-1/3 text-center pb-2 ${
              activeTab === "3" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("3")}
          >
            Descriptors
          </button>
        </div>
        <div className="mt-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 mt-5 grid place-items-center"
          >
            {activeTab === "1" && (
              <>
                <label className="w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Rubric title</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Example: Essay Evaluation Rubric"
                    className="input input-bordered w-full max-w-xs"
                    value={Title.title}
                    onChange={(e) => setTitle({ title: e.target.value })}
                  />
                </label>
                <div className="w-full flex grid-cols-2 justify-center gap-28 md:gap-40 h-5">
                  <h4 className="text-sm">Scoring Scale</h4>
                  <div className="flex justify-items-center items-center space-x-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleFields}
                    >
                      <PlusSquare />
                    </button>
                  </div>
                </div>

                {scale.map((field, index) => (
                  <div
                    key={index}
                    className="flex grid-cols-2 gap-14 items-center"
                  >
                    <label className="w-5 max-w-xs">
                      <div className="label">
                        <span className="label-text">Score</span>
                      </div>
                      <input
                        type="number"
                        min={0}
                        className="input input-bordered w-10 max-w-xs"
                        value={field.score}
                        onChange={(e) =>
                          handleChange(index, "score", e.target.value)
                        }
                      />
                    </label>
                    <label className="w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Description</span>
                      </div>
                      <input
                        type="text"
                        className="input input-bordered w-full max-w-xs"
                        value={field.description}
                        onChange={(e) =>
                          handleChange(index, "description", e.target.value)
                        }
                      />
                    </label>
                    {scale.length > 1 && (
                      <button
                        type="button"
                        className="rounded bg-red-500 text-white h-10 mt-10"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}
            {activeTab === "2" && (
              <div className="w-full p-4">
                <div className="flex justify-center items-center size-8 absolute right-5 bg-cyan-600 rounded ">
                  <h1 onClick={handleAddCriteria}>
                    <SquarePlus />
                  </h1>
                </div>

                <h3 className="text-lg font-semibold mb-2"></h3>
                <div className="grid grid-cols-1 gap-4">
                  {criteriaFields.map((field, index) => (
                    <div key={index} className="flex items-start gap-2 w-full">
                      <label className="form-control flex-1">
                        <div className="label">
                          <span className="label-text">Criteria</span>
                        </div>
                        <textarea
                          className="textarea textarea-bordered h-10 w-full p-2"
                          placeholder="Enter criteria"
                          value={field.criteria}
                          onChange={(e) =>
                            handleCriteria(index, e.target.value)
                          }
                        />
                      </label>

                      {criteriaFields.length > 1 && (
                        <button
                          type="button"
                          className="bg-red-500 rounded flex justify-center items-center h-10 w-8 mt-10 hover:bg-red-700 transition"
                          onClick={() => handleDeleteCriteria(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "3" && (
              <div className="w-full p-4">
                <h3 className="text-lg font-semibold mb-4">Set Descriptors</h3>

                {criteriaFields.map((criteria, criteriaIndex) => (
                  <div key={criteriaIndex} className="mb-6 p-3 rounded-lg">
                    <h4 className="font-medium mb-2">
                      {criteria.criteria || `Criteria ${criteriaIndex + 1}`}
                    </h4>

                    <div className="grid grid-cols-1 gap-3">
                      {scale.map((scoreItem, scoreIndex) => (
                        <div key={scoreIndex} className=" p-2 rounded">
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium mr-2">
                              Scale/Perforamnce level: {scoreItem.score} -
                            </span>
                            <span className="text-xs ">
                              {scoreItem.description}
                            </span>
                          </div>
                          <textarea
                            className="textarea textarea-bordered w-full p-2"
                            placeholder={`Descriptor for this Scale/Performance level`}
                            value={criteria.descriptor[scoreIndex]}
                            onChange={(e) =>
                              handleDescriptorChange(
                                criteriaIndex,
                                scoreIndex,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex grid-cols-2 justify-center m-10 mb-5 gap-4">
                  <div>
                    <button
                      className="btn bg-primary btn-md text-black"
                      disabled={isCreating}
                      type="submit"
                    >
                      {isCreating ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                        </>
                      ) : (
                        "Create"
                      )}
                    </button>
                  </div>
                  <div>
                    <button
                      className="w-20 h-10 rounded btn-neutral"
                      onClick={handleCancel}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-5 flex justify-center">
            <div className="join">
              <button
                className={`join-item btn ${
                  activeTab === "1" && "btn-active"
                } `}
                onClick={() => setActiveTab("1")}
              >
                1
              </button>
              <button
                className={`join-item btn ${
                  activeTab === "2" && "btn-active"
                } `}
                onClick={() => setActiveTab("2")}
              >
                2
              </button>
              <button
                className={`join-item btn ${
                  activeTab === "3" && "btn-active"
                } `}
                onClick={() => setActiveTab("3")}
              >
                3
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRub;
