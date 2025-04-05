// Sample data for patient
export const samplePatient = {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    contact: "5551234567",
    dateOfBirth: new Date(2000, 0, 1),
    gender: "female",
    address: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "USA",
    },
    insuranceInfo: {
        provider: "Health Plus",
        policyNumber: "HP12345678",
    },
    medicalHistory: [
        {
            condition: "Asthma",
            diagnosisDate: new Date(2010, 5, 15),
            treatment: "Inhaler as needed",
        },
    ],
    allergies: ["Peanuts", "Penicillin"],
    emergencyContact: {
        name: "John Johnson",
        relationship: "Father",
        phone: "5559876543",
    },
    profilePicture: "/placeholder.svg?height=200&width=200",
}

// Sample appointment data
export const sampleAppointment = {
    doctorName: "Dr. Michael Smith",
    specialty: "General Physician",
    date: "Tomorrow",
    time: "10:00 AM",
}

