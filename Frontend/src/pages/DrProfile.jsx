import api from '@/api/axios';
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


  return (
   <>
    <div className="flex flex-col items-center mt-10 gap-4 " >
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex justify-evenly mb-4'  >
        <div className="w-16/8 mr-8">
              <label htmlFor="firstname">First Name</label>
              <Input {...register("firstname", {required: 'name is required'})} id='firstname' placeholder='Enter your firstname' />
              {error.firstname && <span>{error.firstname.message}</span> }
            </div>
            <div  className="w-16/8 mr-8">
              <label htmlFor="lastname">Last Name</label>
              <Input {...register("lastname")} id='lastname' placeholder='Enter your lastname' />
              {error.firstname && <span>{error.firstname.message}</span> }
            </div>
          </div>
          
          <div className="w-[410px]  mb-4">
            <label htmlFor="email">Email Address</label>
            <Input {...register("email")} id='email' placeholder='Enter your email' />
            {error.firstname && <span>{error.firstname.message}</span> }
           </div>

            
          <div className='flex  mb-4 '>
            <div className='mr-8'>
              <label htmlFor="phonenumber">phone Number</label>
              <Input {...register("phonenumber")} id='phonenumber'     placeholder='Enter your     number' />
              {error.firstname && <span>{error.firstname.message}</span> }

          

           
          </div>
            <div className=' mb-4'>
              <label htmlFor="location">Location</   label>
              <Input {...register("location")} id='location' placehodler='Enter your location' />
              {error.firstname && <span>{error.firstname.message}</span> }

          </div>




            </div>
          <div className='flex'>
            <div className=' mb-4 mr-20'>
              <label htmlFor="dateofbirth">Date of Birth</   label>
              <Input {...register("dateofbirth")} id='dateofbirth' type='date' placehodler='Enter your birth date' />
              {error.dateofbirth && <span>{error.dateofbirth.message}</span> }

          </div>

          <div >

            <label htmlFor="gender">Gender</label>
            <select name="" id="">
              <option value=""></option>
              <option value=""></option>
              <option value=""></option>
            </select>
          </div>
          </div>

            {role === 'patient' ? (
               <>
               <h1 className='font-bold text-center mb-10'>Medical Information</h1>
               <div className='flex mb-4'> 
               <div className='mr-8'>
                <label htmlFor="bloodgroup">Blood Group</label>
                <Input  {...register("location")} id="bloodgroup" placeholder="Enter your blood group" />
              </div>
              <div>
                <label htmlFor="bloodpressure">Blood Pressure</label>
                <Input  {...register("location")} id="bloodpressure" placeholder="Enter your blood pressure" />
              </div>
              </div>

              <div className='flex mb-4'>
              <div className='mr-8'>
                <label htmlFor="height">Height</label>
                <Input  {...register("location")} id="height" placeholder="Enter your height" />
              </div>
              
              <div>
                <label htmlFor="weight">Weight</label>
                <Input  {...register("location")} id="weight" placeholder="Enter your weight" />
              </div>
              </div>

              <div className='mb-4'> 
                <label htmlFor="diseasehistory">Disease History</label>
                <textarea className='flex w-[460px]  border border-gray-300 p-2 rounded-md focus:outline-none focus:border-red-500' name="disease history" id="diseasehistory"></textarea>
              </div>

              <div className='mb-4'>
              <label htmlFor="drugsensitivity">Drug Sensitivity</label>
              <Input  {...register("location")} id="drugsensitivity" placeholder="If any" />
              </div>
               </>
               ) : role === 'doctor' ? (
                 <>
                  <h1>Doctor's Information</h1>
                  <div>
                    <label htmlFor="specialization">Specialization</label>
                    <Input  {...register("location")} id="specialization" placeholder="Enter your specialization" />
              </div>
              <div>
                <label htmlFor="experience">Years of Experience</label>
                <Input  {...register("location")} id="experience" placeholder="Enter your years of experience" />
              </div>
              <div>
                <label htmlFor="cliniclocation">Clinic Location</label>
                <Input  {...register("location")} id="cliniclocation" placeholder="Enter your clinic location" />
              </div>
              <div>
                <label htmlFor="availability">Availability</label>
                <Input  {...register("location")} id="availability" placeholder="Enter your availability schedule" />
              </div>
              <div className="">
                thus is new divs
              </div>
              <div>
                <label htmlFor="consultationfee">Consultation Fee</label>
                <Input  {...register("location")} id="consultationfee" placeholder="Enter your consultation fee" />
              </div>
              <div>
                <label htmlFor="license">License Number</label>
                <Input  {...register("license")} id="license" placeholder="Enter your license number" />
              </div>
            </>
) : null}
              <div  className=' flex justify-center items-center text-center bg-[#01a0ac] text-white rounded-[10px] h-[40px] ml-70 '  >
              <button className='text-center ' onSubmit={handleChange}>Edit</button>
              </div>
      </form>
    </div>
    </>
  )}

export default DrProfile;
