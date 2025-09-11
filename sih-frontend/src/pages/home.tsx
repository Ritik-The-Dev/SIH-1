import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSection from "../components/filters";
import InternshipCard from "../components/cards";

export default function Home() {
    // const { t } = useTranslation();
    const [showAll, setShowAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        type: "",
        duration: "",
        stipend: "",
        location: "",
        skills: []
    });

    // Sample internship data
    const internships = [
        {
            id: 1,
            title: "Frontend Developer Intern",
            company: "TechSolutions Inc.",
            location: "Remote",
            type: "Full-time",
            duration: "3 months",
            stipend: "₹15,000 /month",
            skills: ["React", "JavaScript", "HTML", "CSS"]
        },
        {
            id: 2,
            title: "Data Science Intern",
            company: "DataInsights Ltd.",
            location: "Bangalore",
            type: "Full-time",
            duration: "6 months",
            stipend: "₹20,000 /month",
            skills: ["Python", "Machine Learning", "SQL", "Data Visualization"]
        },
        {
            id: 3,
            title: "UX/UI Design Intern",
            company: "CreativeMinds Studio",
            location: "Mumbai",
            type: "Part-time",
            duration: "2 months",
            stipend: "₹10,000 /month",
            skills: ["Figma", "UI Design", "Wireframing", "User Research"]
        },
        {
            id: 4,
            title: "Backend Developer Intern",
            company: "ServerStack Technologies",
            location: "Remote",
            type: "Full-time",
            duration: "3 months",
            stipend: "₹18,000 /month",
            skills: ["Node.js", "MongoDB", "Express", "API Development"]
        },
        {
            id: 5,
            title: "Marketing Intern",
            company: "GrowthHackers Digital",
            location: "Delhi",
            type: "Part-time",
            duration: "Flexible",
            stipend: "₹8,000 /month",
            skills: ["Social Media", "Content Writing", "SEO", "Analytics"]
        },
        {
            id: 6,
            title: "Mobile App Developer Intern",
            company: "AppVenture Studios",
            location: "Hyderabad",
            type: "Full-time",
            duration: "3 months",
            stipend: "₹16,000 /month",
            skills: ["React Native", "JavaScript", "iOS", "Android"]
        },
        {
            id: 7,
            title: "Cloud Computing Intern",
            company: "CloudInfra Solutions",
            location: "Remote",
            type: "Full-time",
            duration: "6 months",
            stipend: "₹22,000 /month",
            skills: ["AWS", "Azure", "DevOps", "Linux"]
        },
        {
            id: 8,
            title: "Content Writing Intern",
            company: "WordCraft Publications",
            location: "Remote",
            type: "Part-time",
            duration: "Flexible",
            stipend: "₹7,000 /month",
            skills: ["Content Writing", "SEO", "Research", "Editing"]
        }
    ];

    // Filter internships based on search and filters
    const filteredInternships = internships.filter(internship => {
        // Search filter
        const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            internship.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        // Type filter
        const matchesType = !filters.type || internship.type === filters.type;

        // Duration filter
        const matchesDuration = !filters.duration || internship.duration === filters.duration;

        // Stipend filter
        const matchesStipend = !filters.stipend || (
            filters.stipend === "Unpaid" ? internship.stipend.includes("Unpaid") :
                filters.stipend === "Under ₹5k" ? parseInt(internship.stipend.replace(/[^0-9]/g, '')) < 5000 :
                    filters.stipend === "₹5k - ₹10k" ? parseInt(internship.stipend.replace(/[^0-9]/g, '')) >= 5000 && parseInt(internship.stipend.replace(/[^0-9]/g, '')) <= 10000 :
                        filters.stipend === "₹10k - ₹20k" ? parseInt(internship.stipend.replace(/[^0-9]/g, '')) >= 10000 && parseInt(internship.stipend.replace(/[^0-9]/g, '')) <= 20000 :
                            filters.stipend === "₹20k+" ? parseInt(internship.stipend.replace(/[^0-9]/g, '')) > 20000 : true
        );

        // Location filter
        const matchesLocation = !filters.location || internship.location === filters.location;

        // Skills filter
        const matchesSkills = filters.skills.length === 0 ||
            filters.skills.every(skill => internship.skills.includes(skill));

        return matchesSearch && matchesType && matchesDuration && matchesStipend && matchesLocation && matchesSkills;
    });

    // Get top 5 internships (or all if showAll is true)
    const displayedInternships = showAll ? filteredInternships : filteredInternships.slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Top 5 Curated Internships Specially for Your Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Based on your skills, interests, and career goals
                    </p>
                </div>
                <FilterSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedInternships.map((internship, index) => (
                        <InternshipCard
                            key={internship.id}
                            internship={internship}
                            isFeatured={index < 5 && !showAll}
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
                            <FaFilter className="text-gray-500 dark:text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No internships found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}