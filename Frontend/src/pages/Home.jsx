import BrowseBySpecialty from '@/containers/BrowseBySpecialty';
import FeaturedDoctors from '@/containers/doctor-feature';
import EasyCare from '@/containers/EasyCare'
import Footer from '@/containers/Footer';
import HowItWorks from '@/containers/HowItWork';
import Navbar from '@/containers/Navbar';
// import { useAuth } from '@/Contexts/AuthContext';

const Home = () => {
    return (
        <>
            {/* <Navbar></Navbar> */}

            <Navbar></Navbar>
            <div className="mt-12">
                <EasyCare></EasyCare>
                {/* <FeaturedDoctors></FeaturedDoctors> */}
                <BrowseBySpecialty></BrowseBySpecialty>
                <HowItWorks></HowItWorks>
                <Footer></Footer>
            </div>
        </>
    );
};


export default Home
