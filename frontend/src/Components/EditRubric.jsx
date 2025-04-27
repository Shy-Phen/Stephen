import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";

const EditRubric = () => {
  const { currentAssessment, formData, setFormData, updateAssessment } =
    assessmentFrameworkStore();

  const calculateTotal = (data) => {
    if (!data.scoringScale?.length || !data.criteria?.length) return 0;
    const maxScore = Math.max(
      ...data.scoringScale.map((item) => Number(item.score) || 0)
    );
    return data.criteria.length * maxScore;
  };

  const closeModal = () => {
    document.getElementById("my_modal_3").close();
  };

  const handleTitleChange = (e) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
  };

  const handleScoreChange = (index, value) => {
    const updatedScales = formData.scoringScale.map((scale, i) =>
      i === index ? { ...scale, score: value } : scale
    );
    setFormData({
      ...formData,
      scoringScale: updatedScales,
      total: calculateTotal({ ...formData, scoringScale: updatedScales }),
    });
  };

  const handleDescriptionChange = (index, value) => {
    const updatedScales = formData.scoringScale.map((scale, i) =>
      i === index ? { ...scale, description: value } : scale
    );
    setFormData({
      ...formData,
      scoringScale: updatedScales,
    });
  };

  const handleCriteriaChange = (index, value) => {
    const updatedCriteria = formData.criteria.map((criteria, i) =>
      i === index ? { ...criteria, criteria: value } : criteria
    );
    setFormData({
      ...formData,
      criteria: updatedCriteria,
      total: calculateTotal({ ...formData, criteria: updatedCriteria }),
    });
  };

  const handleDescriptorChange = (criteriaIndex, scaleIndex, value) => {
    const updatedCriteria = formData.criteria.map((criteria, i) => {
      if (i !== criteriaIndex) return criteria;

      const updatedDescriptor = [...(criteria.descriptor || [])];
      updatedDescriptor[scaleIndex] = value;

      return {
        ...criteria,
        descriptor: updatedDescriptor,
      };
    });

    setFormData({
      ...formData,
      criteria: updatedCriteria,
    });
  };

  const handleAddCriteria = () => {
    const updatedCriteria = [...formData.criteria, { criteria: "" }];
    setFormData({
      ...formData,
      criteria: updatedCriteria,
      total: calculateTotal({ ...formData, criteria: updatedCriteria }),
    });
  };

  const handleAddScale = () => {
    const updatedScales = [
      ...formData.scoringScale,
      { score: 0, description: "" },
    ];
    setFormData({
      ...formData,
      scoringScale: updatedScales,
      total: calculateTotal({ ...formData, scoringScale: updatedScales }),
    });
  };

  return (
    <dialog id="my_modal_3" className="modal overflow-y-auto">
      <div className="modal-box max-w-3xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={closeModal}
        >
          ✕
        </button>

        <h3 className="font-bold text-xl text-center mb-4">Edit Rubric</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateAssessment(currentAssessment._id);
            closeModal();
          }}
          className="space-y-6"
        >
          <div className="p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3">Rubric Title</h4>
            <input
              type="text"
              placeholder="Assessment title"
              className="input input-bordered w-full"
              value={formData.title}
              onChange={handleTitleChange}
            />
          </div>

          <div className="p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-lg">Scoring Scales</h4>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddScale}
              >
                Add Scale
              </button>
            </div>
            <div className="mt-3 space-y-4">
              {formData.scoringScale.map((scale, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <div className="col-span-2">
                    <label className="label text-sm">Score</label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={scale.score}
                      onChange={(e) => handleScoreChange(index, e.target.value)}
                    />
                  </div>
                  <div className="col-span-9">
                    <label className="label text-sm">Description</label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={scale.description}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-1 mt-9">
                    <button
                      type="button"
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        const updatedScales = formData.scoringScale.filter(
                          (_, i) => i !== index
                        );
                        setFormData({
                          ...formData,
                          scoringScale: updatedScales,
                          total: calculateTotal({
                            ...formData,
                            scoringScale: updatedScales,
                          }),
                        });
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-lg">Criteria & Descriptors</h4>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddCriteria}
              >
                Add Criteria
              </button>
            </div>
            <div className="mt-3 space-y-6">
              {formData.criteria.map((criteriaItem, criteriaIndex) => (
                <div key={criteriaIndex} className="pb-4 last:border-b-0">
                  <div className="mb-3 flex items-center gap-2">
                    <label className="block text-sm font-medium">
                      Criteria {criteriaIndex + 1}
                    </label>
                    <button
                      type="button"
                      className="btn btn-xs btn-error"
                      onClick={() => {
                        const updatedCriteria = formData.criteria.filter(
                          (_, i) => i !== criteriaIndex
                        );
                        setFormData({
                          ...formData,
                          criteria: updatedCriteria,
                          total: calculateTotal({
                            ...formData,
                            criteria: updatedCriteria,
                          }),
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full mb-3"
                    value={criteriaItem.criteria}
                    onChange={(e) =>
                      handleCriteriaChange(criteriaIndex, e.target.value)
                    }
                  />

                  <div className="ml-4 mt-2">
                    <h5 className="text-sm font-medium mb-2">Descriptors</h5>
                    <div className="space-y-3">
                      {formData.scoringScale.map((scale, scaleIndex) => (
                        <div key={scaleIndex} className="p-3 rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              Score {scale.score}:
                            </span>
                            <span className="text-xs text-gray-600">
                              {scale.description}
                            </span>
                          </div>
                          <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder={`Descriptor for score level ${scale.score}`}
                            value={
                              (criteriaItem.descriptor &&
                                criteriaItem.descriptor[scaleIndex]) ||
                              ""
                            }
                            onChange={(e) =>
                              handleDescriptorChange(
                                criteriaIndex,
                                scaleIndex,
                                e.target.value
                              )
                            }
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-base-200 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Total Possible Score</h4>
            <div className="text-2xl font-bold">{formData.total}</div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button className="btn btn-primary" type="submit">
              Update Rubric
            </button>
            <button
              className="btn btn-neutral"
              onClick={closeModal}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditRubric;
