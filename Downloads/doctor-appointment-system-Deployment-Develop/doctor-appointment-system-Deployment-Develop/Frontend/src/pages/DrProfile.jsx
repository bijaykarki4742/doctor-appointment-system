import api from '@/api/axios';
import { useEffect, useState } from 'react';

const DrProfile = () => {
  // const [doctorData, setDoctorData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await api.get(`/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data.user) {
          throw new Error("User data not found in response");
        }
        console.log(response.data.user);
        setUserData(response.data.user);
        setProfileData(response.data.profile);
        console.log(response.data.profile);
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
  if (!userData) return <div className="text-center py-8">Doctor not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          {profileData?.firstName} {profileData?.lastName}
        </h1>
        {profileData?.age && <p className="text-gray-600">Age: {profileData.age}</p>}
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Personal Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="First Name" value={profileData?.firstName} />
          <InfoField label="Last Name" value={profileData?.lastName} />
          <InfoField label="Email" value={userData?.email} />
          <InfoField label="Phone" value={profileData?.contact} />
          {profileData?.address?.city && (
            <InfoField
              label="Location"
              value={`${profileData.address.city}, ${profileData.address.state}`}
            />
          )}
        </div>
      </section>

      {/* Conditional Professional Info (for Doctors) */}
      {userData?.role === 'doctor' && (
        <>
          <hr className="my-6 border-gray-300" />
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Specialization" value={profileData?.specialization} />
              <InfoField label="License Number" value={profileData?.licenseNumber} />
              <InfoField label="Experience" value={`${profileData?.experience} years`} />
              <InfoField label="Consultation Fee" value={`$${profileData?.consultationFee}`} />
            </div>
          </section>
        </>
      )}

      {/* Bio Section */}
      {profileData?.bio && (
        <>
          <hr className="my-6 border-gray-300" />
          <section>
            <h2 className="text-xl font-semibold mb-2">Bio</h2>
            <p className="text-gray-700">{profileData.bio}</p>
          </section>
        </>
      )}
    </div>
  );
};

// Reusable component for profile fields
const InfoField = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || 'Not provided'}</p>
  </div>
);


export default DrProfile;
