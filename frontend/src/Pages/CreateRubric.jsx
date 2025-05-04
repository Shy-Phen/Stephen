import { PlusSquare, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  rubricFormValidation,
  rubricDefaultValues,
} from "../Validations/rubricFormValidations";

const CreateRub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");
  const [selectedCriterion, setSelectedCriterion] = useState(0);

  const { createAssessment } = assessmentFrameworkStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(rubricFormValidation),
    defaultValues: rubricDefaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const scoringScale = watch("scoringScale");
  const criteriaArray = watch("criteriaArray");

  const {
    fields: fieldScale,
    append: appendScale,
    remove: removeScale,
  } = useFieldArray({
    control,
    name: "scoringScale",
  });

  const {
    fields: fieldCriteria,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({
    control,
    name: "criteriaArray",
  });

  const highestScore = scoringScale.reduce((max, scale) => {
    return Math.max(max, Number(scale.score) || 0);
  }, 0);

  const numberOfCriteria = criteriaArray.length;
  const total = highestScore * numberOfCriteria;

  setValue("total", total);

  const handleAddCriterion = () => {
    const emptyDescriptors = Array(scoringScale.length).fill("");

    appendCriteria({
      criterion: "",
      descriptor: emptyDescriptors,
    });
  };

  const handleCancel = () => {
    navigate("/assessment-framework", { replace: true });
  };

  const onSubmit = async (data) => {
    try {
      await createAssessment(data);
      console.log("Form submitted:", data);
      reset();
      navigate("/assessment-framework", { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
            onSubmit={handleSubmit(onSubmit)}
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
                    {...register("title")}
                  />
                  {errors.title && (
                    <span className="text-red-500 text-xs">
                      {errors.title.message}
                    </span>
                  )}
                </label>
                <div className="w-full flex justify-center gap-28 md:gap-40 h-5">
                  <h4 className="text-sm">Scoring Scale</h4>
                  <div className="flex justify-items-center items-center space-x-2">
                    <button
                      onClick={() =>
                        appendScale({
                          description: "",
                          score: 0,
                        })
                      }
                      type="button"
                      className="btn btn-sm btn-primary"
                    >
                      <PlusSquare size={16} />
                    </button>
                  </div>
                </div>

                {fieldScale.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start mb-4">
                    {/* Score Field */}
                    <div className="flex flex-col w-20">
                      <label className="label pb-1">
                        <span className="label-text">Score</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="input input-bordered w-full"
                        {...register(`scoringScale.${index}.score`, {
                          valueAsNumber: true,
                        })}
                      />
                      <div className="min-h-5">
                        {errors.scoringScale?.[index]?.score && (
                          <span className="text-red-500 text-xs">
                            {errors.scoringScale[index].score.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <label className="label pb-1">
                        <span className="label-text">Description</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        {...register(`scoringScale.${index}.description`)}
                      />
                      <div className="min-h-5">
                        {errors.scoringScale?.[index]?.description && (
                          <span className="text-red-500 text-xs">
                            {errors.scoringScale[index].description.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeScale(index)}
                      className="rounded bg-red-500 text-white h-10 mt-10 p-2"
                      disabled={fieldScale.length <= 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </>
            )}
            {activeTab === "2" && (
              <div className="w-full p-4">
                <div className="flex justify-center mb-4">
                  <button
                    onClick={handleAddCriterion}
                    type="button"
                    className="btn btn-primary"
                  >
                    <PlusSquare size={16} className="mr-2" /> Add Criterion
                  </button>
                </div>

                {fieldCriteria.map((field, criteriaIndex) => (
                  <div key={field.id} className="grid grid-cols-1 gap-4 mb-4">
                    <div className="flex items-start gap-2 w-full">
                      <label className="form-control flex-1">
                        <div className="label">
                          <span className="label-text">
                            Criterion {criteriaIndex + 1}
                          </span>
                        </div>
                        <textarea
                          className="textarea textarea-bordered h-10 w-full p-2"
                          placeholder="Enter criterion"
                          {...register(
                            `criteriaArray.${criteriaIndex}.criterion`
                          )}
                        />
                        {errors.criteriaArray?.[criteriaIndex]?.criterion && (
                          <span className="text-red-500 text-xs">
                            {
                              errors.criteriaArray[criteriaIndex].criterion
                                .message
                            }
                          </span>
                        )}
                      </label>

                      <button
                        type="button"
                        onClick={() => removeCriteria(criteriaIndex)}
                        className="bg-red-500 text-white rounded flex justify-center items-center h-10 w-8 mt-10 hover:bg-red-700 transition"
                        disabled={fieldCriteria.length <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "3" && (
              <div className="w-full p-4">
                <h3 className="text-lg font-semibold mb-4">Set Descriptors</h3>

                <div className="mb-4">
                  <label className="form-control w-full max-w-xs mx-auto">
                    <div className="label">
                      <span className="label-text">Select Criterion</span>
                    </div>
                    <select
                      className="select select-bordered w-full"
                      value={selectedCriterion}
                      onChange={(e) =>
                        setSelectedCriterion(parseInt(e.target.value))
                      }
                    >
                      {fieldCriteria.map((field, index) => (
                        <option key={field.id} value={index}>
                          {criteriaArray[index]?.criterion ||
                            `Criterion ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mb-6 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {criteriaArray[selectedCriterion]?.criterion ||
                      `Criterion ${selectedCriterion + 1}`}
                  </h4>

                  {scoringScale.map((scale, scaleIndex) => (
                    <div
                      key={`${selectedCriterion}-${scaleIndex}`}
                      className="mb-3"
                    >
                      <div className="p-2 rounded">
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-medium mr-2">
                            {scale.description}
                          </span>
                        </div>
                        <textarea
                          className="textarea textarea-bordered w-full p-2"
                          placeholder="Enter Descriptor"
                          {...register(
                            `criteriaArray.${selectedCriterion}.descriptor.${scaleIndex}`
                          )}
                        />
                        {errors.criteriaArray?.[selectedCriterion]
                          ?.descriptor?.[scaleIndex] && (
                          <span className="text-red-500 text-xs">
                            {
                              errors.criteriaArray[selectedCriterion]
                                .descriptor[scaleIndex].message
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-10 mb-5 gap-4">
                  <button
                    className="btn bg-primary btn-md text-black"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating" : "Create"}
                  </button>
                  <button
                    className="btn btn-neutral"
                    onClick={handleCancel}
                    type="button"
                  >
                    Cancel
                  </button>
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
