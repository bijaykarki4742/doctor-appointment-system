import { useEffect, useState } from "react"
import { Search, ChevronDown, Filter, MapPin, Star, Clock, CalendarDays, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import DoctorCard from "@/containers/DoctorCard.jsx"
import Navbar from "@/containers/Navbar.jsx"
import api from "@/api/axios"

// All specialties for the filter
const specialties = [
    "All Specialties",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
]

export default function DoctorList() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
    const [currentPage, setCurrentPage] = useState(1)
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        availableToday: false,
        highlyRated: false,
        newPatients: false
    })
    const doctorsPerPage = 6

    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem("authToken")
                if (!token) {
                    throw new Error("No authentication token found")
                }

                setLoading(true)
                const response = await api.get("/doctors/get", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setDoctors(response.data.allDoctors)
            } catch (error) {
                setError(error.message)
                console.error("Failed to fetch doctors:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDoctors()
    }, [])

    // Toggle filters
    const toggleFilter = (filterName) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }))
    }

    // Filter doctors based on search query, specialty and additional filters
    const filteredDoctors = doctors.filter((doctor) => {
        const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
        const matchesSearch =
            fullName.includes(searchQuery.toLowerCase()) ||
            (doctor.specialization && doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (doctor.hospitalAffiliation && doctor.hospitalAffiliation.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())))

        const matchesSpecialty =
            selectedSpecialty === "All Specialties" ||
            (doctor.specialization && doctor.specialization === selectedSpecialty.replace('ist', 'ology').replace('ian', 'ics'))

        // Additional filters would require data we don't currently have - but the structure is here
        const matchesAdditionalFilters =
            (!filters.availableToday || doctor.availableToday) &&
            (!filters.highlyRated || (doctor.rating >= 4.5)) &&
            (!filters.newPatients || doctor.acceptingNewPatients)

        return matchesSearch && matchesSpecialty && matchesAdditionalFilters
    })

    // Get current doctors for pagination
    const indexOfLastDoctor = currentPage * doctorsPerPage
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)

    // Pagination logic
    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage)

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Generate pagination items
    const getPaginationItems = () => {
        const items = []
        const maxVisiblePages = 5

        // Always show first page
        items.push(
            <PaginationItem key="first">
                <PaginationLink
                    href="#"
                    isActive={currentPage === 1}
                    onClick={(e) => {
                        e.preventDefault()
                        paginate(1)
                    }}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        )

        // Show ellipsis if needed
        if (currentPage > 3) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>
            )
        }

        // Calculate range of pages to show
        let startPage = Math.max(2, currentPage - 1)
        let endPage = Math.min(totalPages - 1, currentPage + 1)

        // Adjust if near beginning or end
        if (currentPage <= 3) {
            endPage = Math.min(totalPages - 1, maxVisiblePages - 1)
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(2, totalPages - (maxVisiblePages - 2))
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={currentPage === i}
                        onClick={(e) => {
                            e.preventDefault()
                            paginate(i)
                        }}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>
            )
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key="last">
                    <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages}
                        onClick={(e) => {
                            e.preventDefault()
                            paginate(totalPages)
                        }}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        return items
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar color="white" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
                {/* Header section */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Find a Doctor</h1>
                    <p className="mt-2 text-gray-600">Browse our network of healthcare professionals</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6">
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search by name, specialty, or location..."
                                className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                                <SelectTrigger className="w-full md:w-[180px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="All Specialties" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200">
                                    {specialties.map((specialty) => (
                                        <SelectItem key={specialty} value={specialty}>
                                            {specialty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2 bg-gray-50 border-gray-200">
                                        <Filter className="h-4 w-4" />
                                        <span>More Filters</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-white">
                                    <DropdownMenuCheckboxItem
                                        checked={filters.availableToday}
                                        onCheckedChange={() => toggleFilter('availableToday')}
                                    >
                                        Available Today
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filters.highlyRated}
                                        onCheckedChange={() => toggleFilter('highlyRated')}
                                    >
                                        Highly Rated (4.5+)
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                        checked={filters.newPatients}
                                        onCheckedChange={() => toggleFilter('newPatients')}
                                    >
                                        Accepting New Patients
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Results section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">
                            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Available
                        </h2>

                        <Select defaultValue="relevance">
                            <SelectTrigger className="w-[140px] bg-white border-gray-200">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="relevance">Relevance</SelectItem>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                                <SelectItem value="availability">Soonest Available</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                            <p className="text-gray-600">Loading doctors...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <p className="text-red-600">{error}</p>
                            <Button
                                variant="outline"
                                className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Doctor Cards */}
                            {currentDoctors.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {currentDoctors.map((doctor) => (
                                        <DoctorCard
                                            key={doctor._id}
                                            doctor={{
                                                id: doctor._id,
                                                name: `${doctor.firstName} ${doctor.lastName}`,
                                                specialty: doctor.specialization || "General Practitioner",
                                                rating: doctor.rating || 4.5,
                                                reviews: doctor.reviewCount || "1.2k",
                                                location: doctor.hospitalAffiliation?.[0] || "Medical Center",
                                                nextAvailable: {
                                                    day: "Today",
                                                    time: "2:00 PM"
                                                },
                                                image: doctor.profilePicture || "/default-doctor.png"
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-lg py-12 text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                                        <Search className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No doctors found</h3>
                                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                                        We couldn't find any doctors matching your search criteria. Try adjusting your filters or search query.
                                    </p>
                                    <div className="mt-6">
                                        <Button
                                            onClick={() => {
                                                setSearchQuery('')
                                                setSelectedSpecialty('All Specialties')
                                                setFilters({
                                                    availableToday: false,
                                                    highlyRated: false,
                                                    newPatients: false
                                                })
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {!loading && filteredDoctors.length > doctorsPerPage && (
                    <div className="flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage > 1) paginate(currentPage - 1)
                                        }}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {getPaginationItems()}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage < totalPages) paginate(currentPage + 1)
                                        }}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    )
}
