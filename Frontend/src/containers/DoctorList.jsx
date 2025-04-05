"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import DoctorCard from "@/containers/DoctorCard.jsx"
import Navbar from "@/containers/Navbar.jsx";
import api from "@/api/axios"

// All specialties for the filter
const specialties = [
    "All Specialties",
    "Cardiologist",
    "Neurologist",
    "Pediatrician",
    "Dermatologist",
    "Orthopedist",
    "Psychiatrist",
]

export default function DoctorList() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
    const [currentPage, setCurrentPage] = useState(1)
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const doctorsPerPage = 6

    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    throw new Error("No authentication token found")
                }

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

    // Filter doctors based on search query and specialty
    const filteredDoctors = doctors.filter((doctor) => {
        const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
        const matchesSearch =
            fullName.includes(searchQuery.toLowerCase()) ||
            (doctor.specialization && doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (doctor.hospitalAffiliation && doctor.hospitalAffiliation.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())))

        const matchesSpecialty =
            selectedSpecialty === "All Specialties" ||
            (doctor.specialization && doctor.specialization === selectedSpecialty.replace('ist', 'ology').replace('ian', 'ics'))

        return matchesSearch && matchesSpecialty
    })

    // Get current doctors for pagination
    const indexOfLastDoctor = currentPage * doctorsPerPage
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    if (loading) return <div className="text-center py-8">Loading...</div>
    if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>

    return (
        <div className="space-y-6">
            <Navbar color="white"></Navbar>
            <div className="p-10 mt-10">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search doctors, specialties..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-white border border-gray-300 shadow-md">
                                <SelectValue placeholder="All Specialties" />
                            </SelectTrigger>
                            <SelectContent className="bg-white shadow-lg border border-gray-300 rounded-md">
                                {specialties.map((specialty) => (
                                    <SelectItem key={specialty} value={specialty} className="hover:bg-gray-100">
                                        {specialty}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex gap-2">
                                    <span>Filters</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-300 rounded-md">
                                <DropdownMenuCheckboxItem checked className="hover:bg-gray-100">
                                    Available Today
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem className="hover:bg-gray-100">
                                    Highly Rated (4.5+)
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem className="hover:bg-gray-100">
                                    New Patients
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Doctor Cards */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentDoctors.length > 0 ? (
                        currentDoctors.map((doctor) => (
                            <DoctorCard
                                key={doctor._id}
                                doctor={{
                                    id: doctor._id,
                                    name: `${doctor.firstName} ${doctor.lastName}`,
                                    specialty: doctor.specialization || "General Practitioner",
                                    rating: 4.5, // Default value if not in your data
                                    reviews: "1.2k", // Default value if not in your data
                                    location: doctor.hospitalAffiliation?.[0] || "Medical Center",
                                    nextAvailable: {
                                        day: "Today",
                                        time: "2:00 PM"
                                    },
                                    image: doctor.profilePicture || "/default-doctor.png"
                                }}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-muted-foreground">No doctors found matching your search criteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredDoctors.length > doctorsPerPage && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage > 1) paginate(currentPage - 1)
                                    }}
                                />
                            </PaginationItem>
                            {[...Array(Math.ceil(filteredDoctors.length / doctorsPerPage))].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === i + 1}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            paginate(i + 1)
                                        }}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage < Math.ceil(filteredDoctors.length / doctorsPerPage)) {
                                            paginate(currentPage + 1)
                                        }
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    )
}
