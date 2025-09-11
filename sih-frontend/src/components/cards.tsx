import { useState } from "react";
import { FaBookmark, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

export default function InternshipCard({ internship, isFeatured = false }: any){
    const [isSaved, setIsSaved] = useState(false);

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${isFeatured ? 'border-2 border-blue-500' : 'border border-gray-200 dark:border-gray-700'}`}>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{internship.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{internship.company}</p>
                    </div>
                    <button
                        onClick={() => setIsSaved(!isSaved)}
                        className={`p-2 rounded-full ${isSaved ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <FaBookmark />
                    </button>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaMapMarkerAlt className="mr-1" />
                        {internship.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaBriefcase className="mr-1" />
                        {internship.type}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaCalendarAlt className="mr-1" />
                        {internship.duration}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {internship.skills.map((skill: any, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">{internship.stipend}</span>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};