import { useState } from "react";
import { FaClipboardCheck } from "react-icons/fa";
import FilterSection from "../components/filters";
import InternshipCard from "../components/cards";

export default function MyApplications() {
    const [showAll, setShowAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        type: "",
        duration: "",
        stipend: "",
        location: "",
        skills: []
    });

    // Sample applications (replace later with DB or API data)
    const appliedInternships = [
        {
            id: 11,
            title: "AI/ML Research Intern",
            company: "Innovate Labs",
            location: "Remote",
            type: "Full-time",
            duration: "4 months",
            stipend: "₹25,000 /month",
            skills: ["Python", "TensorFlow", "Deep Learning", "NLP"],
            status: "Under Review"
        },
        {
            id: 12,
            title: "Business Analyst Intern",
            company: "GrowthEdge Consulting",
            location: "Mumbai",
            type: "Part-time",
            duration: "3 months",
            stipend: "₹12,000 /month",
            skills: ["Excel", "SQL", "Data Analysis", "Power BI"],
            status: "Shortlisted"
        },
        {
            id: 13,
            title: "Frontend Developer Intern",
            company: "Webify Solutions",
            location: "Delhi",
            type: "Full-time",
            duration: "6 months",
            stipend: "₹18,000 /month",
            skills: ["React", "TypeScript", "CSS", "Tailwind"],
            status: "Applied"
        }
    ];

    // Apply same filters as Home/Favourite
    const filteredInternships = appliedInternships.filter(internship => {
        const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            internship.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = !filters.type || internship.type === filters.type;
        const matchesDuration = !filters.duration || internship.duration === filters.duration;

        const matchesStipend = !filters.stipend || (
            filters.stipend === "Unpaid" ? internship.stipend.includes("Unpaid") :
                filters.stipend === "Under ₹5k" ? parseInt(internship.stipend.replace(/[^0-9]/g, '')) < 5000 :
                    filters.stipend === "₹5k - ₹10k" ? parseInt(internship.stipend.replace(/[^0-9]/g, '')) >= 5000 && parseInt(internship.stipend.replace(/[^0-9]/g, '')) <= 10000 :
                        filters.stipend === "₹10k - ₹20k" ? parseInt(internship.stipend.replace(/[^0-9]/g, '')) >= 10000 && parseInt(internship.stipend.replace(/[^0-9]/g, '')) <= 20000 :
                            filters.stipend === "₹20k+" ? parseInt(internship.stipend.replace(/[^0-9]/g, '')) > 20000 : true
        );

        const matchesLocation = !filters.location || internship.location === filters.location;
        const matchesSkills = filters.skills.length === 0 || filters.skills.every(skill => internship.skills.includes(skill));

        return matchesSearch && matchesType && matchesDuration && matchesStipend && matchesLocation && matchesSkills;
    });

    const displayedInternships = showAll ? filteredInternships : filteredInternships.slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        My Applications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track internships you have applied to
                    </p>
                </div>

                <FilterSection
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    setFilters={setFilters}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedInternships.map((internship) => (
                        <InternshipCard
                            key={internship.id}
                            internship={internship}
                            isFeatured={false}
                            // Passing status so InternshipCard can show e.g. "Applied", "Shortlisted"
                            status={internship.status}
                        />
                    ))}
                </div>

                {filteredInternships.length > 5 && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                        >
                            {showAll ? 'Show Less' : `Show All (${filteredInternships.length})`}
                        </button>
                    </div>
                )}

                {filteredInternships.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
                            <FaClipboardCheck className="text-gray-500 dark:text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">Your applied internships will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
