import api from '@/api/axios';
import ProfileCard from '@/components/profile/ProfileCard'
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileTabs from '@/components/profile/ProfileTabs';
import AboutTab from '@/components/profile/tabs/AboutTab';
import AppointmentTab from '@/components/profile/tabs/AppointmentTab';
import ExperienceTab from '@/components/profile/tabs/Experience';
import ReviewsTab from '@/components/profile/tabs/ReviewsTab';
import { useEffect, useState } from 'react';

const DrProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await api.get(`/doctors/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data.doctor) {
          throw new Error("Doctor data not found in response");
        }
        console.log(response.data.doctor);
        setDoctorData(response.data.doctor);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!doctorData) return <div className="text-center py-8">Doctor not found</div>;

  // Prepare the data for components
  const fullName = `${doctorData.firstName} ${doctorData.lastName}`;
  const specializations = doctorData.specialization ? [doctorData.specialization] : [];
  const languages = doctorData.languagesSpoken || [];
  const experiences = [{
    position: "Doctor",
    hospital: doctorData.hospitalAffiliation?.join(', ') || '',
    duration: `${doctorData.experience} years`,
    description: ""
  }];

  // Create tabs
  const tabs = [
    {
      id: "about",
      label: "About",
      content: (
        <AboutTab
          bio={doctorData.bio}
          specializations={specializations}
          languages={languages}
          isDoctor={true}
        />
      ),
    },
    {
      id: "experience",
      label: "Experience",
      content: (
        <ExperienceTab
          experiences={experiences}
          education={doctorData.qualifications?.map(q => ({
            degree: q,
            university: "",
            year: ""
          })) || []}
        />
      ),
    },
    {
      id: "reviews",
      label: "Reviews",
      content: (
        <ReviewsTab
          reviews={doctorData.reviews || []}
          totalReviews={doctorData.reviews?.length || 0}
          showMoreAction={() => console.log("Load more reviews clicked")}
        />
      ),
    },
    {
      id: "book",
      label: "Book",
      content: (
        <AppointmentTab
          isDoctor={true}
          availableTimeSlots={doctorData.availableTimeSlots || []}
          consultationFee={doctorData.consultationFee}
        />
      ),
    },
  ];

  return (
    <ProfileLayout
      sidebar={
        <ProfileCard
          name={fullName}
          title={specializations.join(', ')}
          subtitle={doctorData.qualifications?.join(', ')}
          imageSrc={doctorData.profilePicture || '/default-doctor.jpeg'}
          rating={{
            value: doctorData.rating?.value || 0,
            count: doctorData.reviews?.length || 0
          }}
          contactInfo={{
            phone: doctorData.contact,
            email: "", // Add if available in API
            address: doctorData.hospitalAffiliation?.join(', ') || ''
          }}
          actionButton={{
            text: "Contact Doctor",
            onClick: () => console.log("Contact doctor clicked"),
          }}
          isVerified={doctorData.isVerified}
        />
      }
      content={<ProfileTabs tabs={tabs} defaultTab="about" />}
    />
  );
};

export default DrProfile;
