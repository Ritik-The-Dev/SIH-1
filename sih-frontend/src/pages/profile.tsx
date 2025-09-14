import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { themeState } from "../store/theme";
import { userState } from "../store/profile";
import { useExtractText, useUpdateProfile } from "../services/hooks";
import toast from "react-hot-toast";

export default function Profile() {
  const { t } = useTranslation();
  const darkMode = useRecoilValue(themeState);
  const user: any = useRecoilValue(userState);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: updateProfile, isLoading: updating } = useUpdateProfile();
  const { mutateAsync: parseResume, isLoading: extracting } = useExtractText();

  // ✅ State for all profile fields
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    skills: "",
  });

  const [education, setEducation] = useState([{ school: "", degree: "", year: "" }]);
  const [experience, setExperience] = useState([{ company: "", role: "", duration: "", description: "" }]);
  const [projects, setProjects] = useState([{ title: "", description: "", tech: "" }]);
  const [certifications, setCertifications] = useState([{ name: "", org: "", year: "" }]);

  // ✅ Store resume name + url
  const [resumes, setResumes] = useState<{ name: string; url: string }[]>([]);

  // ✅ Populate defaults from user
  useEffect(() => {
    if (user) {
      setBasicInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.number || "",
        address: user.address || "",
        skills: user.skills?.join(", ") || "",
      });
      setEducation(user.education?.length ? user.education : [{ school: "", degree: "", year: "" }]);
      setExperience(user.experience?.length ? user.experience : [{ company: "", role: "", duration: "", description: "" }]);
      setProjects(user.projects?.length ? user.projects : [{ title: "", description: "", tech: "" }]);
      setCertifications(user.certifications?.length ? user.certifications : [{ name: "", org: "", year: "" }]);
      setResumes(user.resumes || []); // in case backend already has resumes
    }
  }, [user]);

  const handleAdd = (setter: any, state: any, newItem: any) => setter([...state, newItem]);
  const handleRemove = (setter: any, state: any, index: number) =>
    setter(state.filter((_: any, i: number) => i !== index));

  // ✅ Upload resumes to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);

      if (!e.target.files) return;
      const files = Array.from(e.target.files);

      // ✅ Validate PDFs
      const invalidFiles = files.filter((file) => file.type !== "application/pdf");
      if (invalidFiles.length > 0) {
        toast.error("Only PDF files are allowed.");
        return;
      }

      const uploadedResumes: { name: string; url: string }[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "unsigned_resume_upload");
        formData.append("folder", "resumes");

        try {
          const res = await fetch("https://api.cloudinary.com/v1_1/dw4gtg42m/auto/upload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (data.secure_url) {
            uploadedResumes.push({ name: file.name, url: data.secure_url });
          } else {
            toast.error(`Failed to upload ${file.name}`);
          }
        } catch (err) {
          console.error("Upload error:", err);
          toast.error(`Error uploading ${file.name}`);
        }
      }

      if (uploadedResumes.length > 0) {
        toast.success("Resumes uploaded successfully");
        setResumes((prev) => [...prev, ...uploadedResumes]);
      }
    } catch (err) {
      console.error("Something Went Wrong", err);
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Parse resume text + auto-fill profile
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const firstFile = files[0];

    if (firstFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    // Auto-extract text from the first file
    const formData = new FormData();
    formData.append("resume", firstFile);

    try {
      const res: any = await parseResume(formData);
      if (res.success) {
        const { extracted } = res;

        setBasicInfo((prev) => ({
          ...prev,
          name: extracted.name || prev.name,
          phone: extracted.phone || prev.phone,
          address: extracted.address || prev.address,
          skills: extracted.skills?.join(", ") || prev.skills,
        }));

        if (Array.isArray(extracted.education) && extracted.education.length > 0) {
          setEducation(
            extracted.education.map((edu: any) => ({
              school: edu?.school || edu?.institution || "",
              degree: edu?.degree || "",
              year: edu?.year || edu?.endDate || "",
            }))
          );
        }

        if (Array.isArray(extracted.experience) && extracted.experience.length > 0) {
          setExperience(
            extracted.experience.map((exp: any) => ({
              company: exp.company || "",
              role: exp.role || "",
              duration: exp.duration || "",
              description: exp.description || "",
            }))
          );
        }

        if (Array.isArray(extracted.projects) && extracted.projects.length > 0) {
          setProjects(
            extracted.projects.map((proj: any) => ({
              title: proj.title || "",
              description: proj.description || "",
              tech: proj.tech || "",
            }))
          );
        }

        if (Array.isArray(extracted.certifications) && extracted.certifications.length > 0) {
          setCertifications(
            extracted.certifications.map((cert: any) => ({
              name: cert.name || "",
              org: cert.org || "",
              year: cert.year || "",
            }))
          );
        }
      }

      // Also upload resumes
      handleFileUpload(e);
    } catch (err) {
      console.error("Failed to parse resume", err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        name: basicInfo.name,
        number: basicInfo.phone,
        address: basicInfo.address,
        skills: basicInfo.skills.split(",").map((s) => s.trim()),
        education,
        experience,
        projects,
        certifications,
        resumes,
      };

      const res: any = await updateProfile(payload);

      if (res.success) {
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const dynamicSections = [
    { title: t("Education"), state: education, setter: setEducation, fields: ["school", "degree", "year"] },
    { title: t("Experience"), state: experience, setter: setExperience, fields: ["company", "role", "duration", "description"] },
    { title: t("Projects"), state: projects, setter: setProjects, fields: ["title", "tech", "description"] },
    { title: t("Certifications"), state: certifications, setter: setCertifications, fields: ["name", "org", "year"] },
  ];

  return (
    <div
      className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-4xl mx-auto p-6 space-y-10 rounded-xl shadow-lg transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex w-full items-center justify-between ">
          <h1 className="text-3xl font-bold">{t("Profile")}</h1>
          <section>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleResumeUpload}
              className="hidden"
              id="resumeUpload"
            />
            <label
              htmlFor="resumeUpload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              <FaUpload /> {extracting ? t("Extracting...") : t("Autofill")}
            </label>
          </section>
        </div>

        {/* Basic Info */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("Basic Information")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["name", "email", "phone", "address"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                placeholder={t(field)}
                value={(basicInfo as any)[field]}
                readOnly={field === "email"}
                onChange={(e) => setBasicInfo({ ...basicInfo, [field]: e.target.value })}
                className={`p-3 ${
                  field === "email" ? "cursor-not-allowed" : ""
                } border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                }`}
              />
            ))}
            <input
              type="text"
              placeholder={t("skills")}
              value={basicInfo.skills}
              onChange={(e) => setBasicInfo({ ...basicInfo, skills: e.target.value })}
              className={`p-3 border rounded-lg w-full col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
              }`}
            />
          </div>
        </section>

        {/* Dynamic Sections */}
        {dynamicSections.map((section, sIndex) => (
          <section key={sIndex}>
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.state.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                  } flex flex-col gap-3`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {section.fields.map((field, fIndex) => (
                      <input
                        key={fIndex}
                        type="text"
                        placeholder={t(field)}
                        value={item[field]}
                        onChange={(e) => {
                          const updated: any = [...section.state];
                          updated[index][field] = e.target.value;
                          section.setter(updated);
                        }}
                        className={`p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-600 text-white border-gray-500"
                            : "bg-white text-gray-900 border-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleRemove(section.setter, section.state, index)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600"
                    >
                      <FaTrash /> {t("Delete")}
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  handleAdd(
                    section.setter,
                    section.state,
                    Object.fromEntries(section.fields.map((f) => [f, ""]))
                  )
                }
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <FaPlus /> {t(`Add ${section.title}`)}
              </button>
            </div>
          </section>
        ))}

        {/* Resume Upload */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("Upload Resumes")}</h2>
          <input
            type="file"
            accept=".pdf"
            disabled={isUploading}
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="Upload"
          />
          <label
            htmlFor="Upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <FaUpload /> {isUploading ? t("Uploading...") : t("Upload Files")}
          </label>
          <ul className="mt-4 space-y-2">
            {resumes.map((file, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-2 rounded ${
                  darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <a href={file.url} target="_blank" className="truncate cursor-pointer hover:underline">{file.name}</a>
                <button
                  onClick={() => setResumes((prev) => prev.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Save Button */}
        <div className="text-right">
          <button
            onClick={handleSaveProfile}
            className={`px-6 py-3 rounded-lg transition-colors ${
              (updating || isUploading) ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isUploading ? "Uploading Resumes..." : updating ? t("Saving...") : t("Save Profile")}
          </button>
        </div>
      </div>
    </div>
  );
}
