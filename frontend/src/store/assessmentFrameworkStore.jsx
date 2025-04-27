import { create } from "zustand";
import { axiosInstance } from "../axios/axios";
import toast from "react-hot-toast";

export const assessmentFrameworkStore = create((set, get) => ({
  assessments: [],
  isCreating: false,
  loading: false,
  currentAssessment: null,

  formData: {
    title: "",
    scoringScale: [{ score: 0, description: "" }],
    criteria: [{ criteria: "" }],
    total: 0,
  },

  setFormData: (formData) => set({ formData }),

  createAssessment: async (data) => {
    try {
      set({ isCreating: true });
      await axiosInstance.post("/assessment-framework", data);
      get().getAllAssessmentFramework();
      toast.success("Rubric Created");
    } catch (error) {
      toast.error(error);
    } finally {
      set({ isCreating: false });
    }
  },

  getAllAssessmentFramework: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/assessment-framework");
      set({ assessments: res.data });
    } catch (error) {
      toast.error(error);
    } finally {
      set({ loading: false });
    }
  },

  deleteAssessment: async (id) => {
    set({ loading: true });
    try {
      console.log(`Deleting assessment with ID: ${id}`);
      await axiosInstance.delete(`/assessment-framework/${id}`);
      set((state) => ({
        assessments: state.assessments.filter(
          (assessment) => assessment._id !== id
        ),
      })),
        toast.success("Rubric deleted succesfully");
      console.log("hah");
    } catch (error) {
      toast.error(error);
    } finally {
      set({ loading: false });
    }
  },

  getOneAssessment: async (id) => {
    set({ loading: true });
    console.log(`Your current Id ${id}`);
    try {
      const res = await axiosInstance.get(`/assessment-framework/${id}`);
      console.log("Fetched assessment:", res.data.assessmentFramework);
      set({
        currentAssessment: res.data.assessmentFramework,
        formData: res.data.assessmentFramework,
      });
    } catch (error) {
      console.log("Error in getting assessment", error);
    } finally {
      set({ loading: false });
    }
  },

  updateAssessment: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const res = await axiosInstance.put(
        `/assessment-framework/${id}`,
        formData
      );
      set({ currentAssessment: res.data.updatedFramework });
      set((state) => ({
        assessments: state.assessments.map((assess) =>
          assess._id === id ? res.data.updatedFramework : assess
        ),
      }));
      document.getElementById("my_modal_3").close();
      toast.success("Rubric updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error in updateProduct function", error);
    } finally {
      set({ loading: false });
    }
  },
}));
