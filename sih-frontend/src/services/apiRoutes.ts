export const basePath = import.meta.env.VITE_ENV_URL;


export const signUpApiPath = `${basePath}/api/v1/signUp`;
export const loginApiPath = `${basePath}/api/v1/login`;
export const loginWithGoogleApiPath = `${basePath}/api/v1/signInWithGoogle`;
export const logoutApiPath = `${basePath}/api/v1/logout`;
export const getProfileApiPath = `${basePath}/api/v1/profile`;
export const updateProfileApiPath = `${basePath}/api/v1/updateProfile`;
export const recommendJobApiPath = `${basePath}/api/v1/recommend`;
export const applyForJobApiPath = `${basePath}/api/v1/apply`;
export const myApplicationsApiPath = `${basePath}/api/v1/myApplications`;
export const extractTextApiPath = `${basePath}/api/v1/extract`;
export const uploadResumeApiPath = `${basePath}/api/v1/upload`;
