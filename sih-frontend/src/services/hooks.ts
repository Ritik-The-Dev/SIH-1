import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  loginApi,
  signUpApi,
  updateProfileApi,
  getProfileApi,
  recommendApi,
  applyForJobApi,
  myApplicationsApi,
  extractTextApi,
  logoutApi,
  uploadResumeApi,
  loginWithGoogleApi,
} from "./api";
import toast from "react-hot-toast";

// Helper to get proper error message
const getErrorMessage = (error: any) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
};

// Login API hook
export const useLogin = () => {
  return useMutation((payload: any) => loginApi(payload), {
    onSuccess: (data: any) => {
      if (data.success) toast.success(data.message || "Login successful");
      return data;
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

// Login API hook
export const useLoginWithGoogle = () => {
  return useMutation((payload: any) => loginWithGoogleApi(payload), {
    onSuccess: (data: any) => {
      if (data.success) toast.success(data.message || "Login successful");
      return data;
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      toast.error(getErrorMessage(error));
    },
  });
}

// Login API hook
export const useLogout = () => {
  return useMutation(() => logoutApi(), {
    onSuccess: (data: any) => {
      if (data.success) toast.success(data.message || "Logout successful");
      return data;
    },
    onError: (error: any) => {
      console.error("Logout failed:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

// Sign Up API hook
export const useSignUp = () => {
  return useMutation((payload: any) => signUpApi(payload), {
    onSuccess: (data: any) => {
      if (data.success) toast.success(data.message || "Sign up successful");
      return data;
    },
    onError: (error: any) => {
      console.error("Sign up failed:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

// Update Profile API hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: any) => updateProfileApi(payload), {
    onSuccess: (data: any) => {
      if (data.success) {
        queryClient.invalidateQueries(["profile"]);
        toast.success(data.message || "Profile updated successfully");
      }
      return data;
    },
    onError: (error: any) => {
      console.error("Profile update failed:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

// Get Profile API hook
export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileApi(),
    onError: (error: any) => {
      console.error("Failed to fetch profile:", error);
      // toast.error(getErrorMessage(error));
    },
  });
};

// Recommend Jobs API hook
export const useRecommendJobs = (filters?: any) => {
  return useQuery({
    queryKey: ["recommendedJobs", filters],
    queryFn: () => recommendApi(filters),
  });
};

// Apply for Job API hook
export const useApplyForJob = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: any) => applyForJobApi(payload), {
    onSuccess: (data: any) => {
      if (data.success) {
        queryClient.invalidateQueries(["myApplications"]);
        queryClient.invalidateQueries(["recommendedJobs"]);
        toast.success(data.message || "Application submitted successfully");
        return data;
      }
      return data;
    },
    onError: (error: any) => {
      console.error("Job application failed:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

// Recommend Jobs API hook
export const useMyApplications = (filters?: any) => {
  return useQuery({
    queryKey: ["myApplications", filters],
    queryFn: () => myApplicationsApi(filters),
  });
};

// Extract Text API hook
export const useExtractText = () => {
  return useMutation((payload: any) => extractTextApi(payload), {
    onSuccess: (data: any) => {
      if (data.success) toast.success(data.message || "Text extracted successfully");
      return data;
    },
    onError: (error: any) => {
      console.error("Text extraction failed:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

// Extract Text API hook
export const useUploadResume = () => {
  return useMutation((payload: any) => uploadResumeApi(payload), {
    onSuccess: (data: any) => {
      return data;
    },
    onError: (error: any) => {
      console.error("Resume Uploadation failed:", error);
      toast.error(getErrorMessage(error));
    },
  });
};
