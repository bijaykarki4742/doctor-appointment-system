"use client"

import { useState } from "react"
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

// Sample doctor data
const doctors = [
    {
        id: 1,
        name: "Dr. John Smith",
        specialty: "Cardiologist",
        rating: 4.8,
        reviews: "2.1k",
        location: "New York Medical Center",
        nextAvailable: {
            day: "Today",
            time: "2:00 PM",
        },
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 2,
        name: "Dr. Sarah Johnson",
        specialty: "Neurologist",
        rating: 4.9,
        reviews: "1.8k",
        location: "Central Hospital",
        nextAvailable: {
            day: "Tomorrow",
            time: "10:00 AM",
        },
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 3,
        name: "Dr. Michael Chen",
        specialty: "Pediatrician",
        rating: 4.7,
        reviews: "1.5k",
        location: "Children's Hospital",
        nextAvailable: {
            day: "Today",
            time: "4:30 PM",
        },
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 4,
        name: "Dr. Emily Wilson",
        specialty: "Dermatologist",
        rating: 4.9,
        reviews: "2.3k",
        location: "Skin Care Clinic",
        nextAvailable: {
            day: "Tomorrow",
            time: "1:00 PM",
        },
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 5,
        name: "Dr. Robert Taylor",
        specialty: "Orthopedist",
        rating: 4.8,
        reviews: "1.9k",
        location: "Sports Medicine Center",
        nextAvailable: {
            day: "Today",
            time: "5:30 PM",
        },
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 6,
        name: "Dr. Lisa Anderson",
        specialty: "Psychiatrist",
        rating: 4.9,
        reviews: "1.7k",
        location: "Mental Health Institute",
        nextAvailable: {
            day: "Tomorrow",
            time: "11:30 AM",
        },
        image: "/placeholder.svg?height=80&width=80",
    },
]

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
    const doctorsPerPage = 6

    // Filter doctors based on search query and specialty
    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch =
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.location.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesSpecialty = selectedSpecialty === "All Specialties" || doctor.specialty === selectedSpecialty

        return matchesSearch && matchesSpecialty
    })

    // Get current doctors for pagination
    const indexOfLastDoctor = currentPage * doctorsPerPage
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="All Specialties" />
                            </SelectTrigger>
                            <SelectContent>
                                {specialties.map((specialty) => (
                                    <SelectItem key={specialty} value={specialty}>
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
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem checked>Available Today</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Highly Rated (4.5+)</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>New Patients</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Doctor Cards */}
                <div className=" mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentDoctors.length > 0 ? (
                        currentDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
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
