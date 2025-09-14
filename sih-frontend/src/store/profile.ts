import { atom } from "recoil";

export interface UserInfo {
  _id?: string;           
  name: string;
  email: string;
  number?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills: string[];
  education: string[];
  projects: string[];
  experience: string[];
  certifications: string[];
  address?: string;
  favourites: string[];    
  applications: string[];  
  resumes: string[];
  profileCompletion: number;
}

export const userState = atom<UserInfo>({
  key: "userState",
  default: {
    _id: "",
    name: "",
    email: "",
    number: "",
    avatarUrl: "",
    bio: "",
    location: "",
    website: "",
    skills: [],
    education: [],
    projects: [],
    experience: [],
    certifications: [],
    address: "",
    favourites: [],
    applications: [],
    resumes: [],
    profileCompletion: 0
  },
  effects: [
    ({ onSet }) => {
      onSet((newUser) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(newUser));
        }
      });
    }
  ],
});
