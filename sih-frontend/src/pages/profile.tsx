import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";

export default function Profile() {
    const { t } = useTranslation();

    // State for profile fields
    const [basicInfo, setBasicInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        skills: ""
    });

    const [education, setEducation] = useState([{ school: "", degree: "", year: "" }]);
    const [experience, setExperience] = useState([{ company: "", role: "", duration: "", description: "" }]);
    const [projects, setProjects] = useState([{ title: "", description: "", tech: "" }]);
    const [certifications, setCertifications] = useState([{ name: "", org: "", year: "" }]);
    const [resumes, setResumes] = useState<File[]>([]);

    // Handlers for adding/removing dynamic sections
    const handleAdd = (setter: any, state: any, newItem: any) => {
        setter([...state, newItem]);
    };

    const handleRemove = (setter: any, state: any, index: number) => {
        setter(state.filter((_: any, i: number) => i !== index));
    };

    // File uploads
    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setResumes([...resumes, ...Array.from(e.target.files)]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow rounded-xl p-6 space-y-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("Profile")}</h1>

                {/* Basic Info */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" value={basicInfo.name}
                            onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                            className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:text-white" />
                        <input type="email" placeholder="Email" value={basicInfo.email}
                            onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                            className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:text-white" />
                        <input type="text" placeholder="Phone Number" value={basicInfo.phone}
                            onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                            className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:text-white" />
                        <input type="text" placeholder="Address" value={basicInfo.address}
                            onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
                            className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:text-white" />
                        <input type="text" placeholder="Skills (comma separated)" value={basicInfo.skills}
                            onChange={(e) => setBasicInfo({ ...basicInfo, skills: e.target.value })}
                            className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:text-white col-span-2" />
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Education</h2>
                    {education.map((edu, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <input type="text" placeholder="School/College" value={edu.school}
                                onChange={(e) => {
                                    const updated = [...education];
                                    updated[index].school = e.target.value;
                                    setEducation(updated);
                                }}
                                className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:text-white" />
                            <input type="text" placeholder="Degree" value={edu.degree}
                                onChange={(e) => {
                                    const updated = [...education];
                                    updated[index].degree = e.target.value;
                                    setEducation(updated);
                                }}
                                className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:text-white" />
                            <input type="text" placeholder="Year" value={edu.year}
                                onChange={(e) => {
                                    const updated = [...education];
                                    updated[index].year = e.target.value;
                                    setEducation(updated);
                                }}
                                className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:text-white" />
                            <button onClick={() => handleRemove(setEducation, education, index)}
                                className="text-red-500 flex items-center mt-2"><FaTrash /></button>
                        </div>
                    ))}
                    <button onClick={() => handleAdd(setEducation, education, { school: "", degree: "", year: "" })}
                        className="text-blue-600 flex items-center gap-2"><FaPlus /> Add Education</button>
                </section>

                {/* Experience */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Experience</h2>
                    {experience.map((exp, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                            <input type="text" placeholder="Company" value={exp.company}
                                onChange={(e) => {
                                    const updated = [...experience];
                                    updated[index].company = e.target.value;
                                    setExperience(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
                            <input type="text" placeholder="Role" value={exp.role}
                                onChange={(e) => {
                                    const updated = [...experience];
                                    updated[index].role = e.target.value;
                                    setExperience(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
                            <input type="text" placeholder="Duration" value={exp.duration}
                                onChange={(e) => {
                                    const updated = [...experience];
                                    updated[index].duration = e.target.value;
                                    setExperience(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
                            <input type="text" placeholder="Description" value={exp.description}
                                onChange={(e) => {
                                    const updated = [...experience];
                                    updated[index].description = e.target.value;
                                    setExperience(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white col-span-2" />
                            <button onClick={() => handleRemove(setExperience, experience, index)}
                                className="text-red-500 flex items-center mt-2"><FaTrash /></button>
                        </div>
                    ))}
                    <button onClick={() => handleAdd(setExperience, experience, { company: "", role: "", duration: "", description: "" })}
                        className="text-blue-600 flex items-center gap-2"><FaPlus /> Add Experience</button>
                </section>

                {/* Projects */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Projects</h2>
                    {projects.map((proj, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <input type="text" placeholder="Project Title" value={proj.title}
                                onChange={(e) => {
                                    const updated = [...projects];
                                    updated[index].title = e.target.value;
                                    setProjects(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
                            <input type="text" placeholder="Tech Stack" value={proj.tech}
                                onChange={(e) => {
                                    const updated = [...projects];
                                    updated[index].tech = e.target.value;
                                    setProjects(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
                            <input type="text" placeholder="Description" value={proj.description}
                                onChange={(e) => {
                                    const updated = [...projects];
                                    updated[index].description = e.target.value;
                                    setProjects(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white col-span-2" />
                            <button onClick={() => handleRemove(setProjects, projects, index)}
                                className="text-red-500 flex items-center mt-2"><FaTrash /></button>
                        </div>
                    ))}
                    <button onClick={() => handleAdd(setProjects, projects, { title: "", description: "", tech: "" })}
                        className="text-blue-600 flex items-center gap-2"><FaPlus /> Add Project</button>
                </section>

                {/* Certifications */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Certifications</h2>
                    {certifications.map((cert, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <input type="text" placeholder="Certification Name" value={cert.name}
                                onChange={(e) => {
                                    const updated = [...certifications];
                                    updated[index].name = e.target.value;
                                    setCertifications(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
                            <input type="text" placeholder="Organization" value={cert.org}
                                onChange={(e) => {
                                    const updated = [...certifications];
                                    updated[index].org = e.target.value;
                                    setCertifications(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
                            <input type="text" placeholder="Year" value={cert.year}
                                onChange={(e) => {
                                    const updated = [...certifications];
                                    updated[index].year = e.target.value;
                                    setCertifications(updated);
                                }}
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
                            <button onClick={() => handleRemove(setCertifications, certifications, index)}
                                className="text-red-500 flex items-center mt-2"><FaTrash /></button>
                        </div>
                    ))}
                    <button onClick={() => handleAdd(setCertifications, certifications, { name: "", org: "", year: "" })}
                        className="text-blue-600 flex items-center gap-2"><FaPlus /> Add Certification</button>
                </section>

                {/* Resume Upload */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Upload Resumes</h2>
                    <input type="file" multiple onChange={handleResumeUpload}
                        className="hidden" id="resumeUpload" />
                    <label htmlFor="resumeUpload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                        <FaUpload /> Upload Files
                    </label>
                    <ul className="mt-4 space-y-2">
                        {resumes.map((file, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                <span className="text-gray-700 dark:text-gray-200">{file.name}</span>
                                <button onClick={() => handleRemove(setResumes, resumes, index)} className="text-red-500"><FaTrash /></button>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Save Button */}
                <div className="text-right">
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
