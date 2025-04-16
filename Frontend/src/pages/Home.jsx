import EasyCare from '@/containers/EasyCare'
import Navbar from '@/containers/Navbar';
// import { useAuth } from '@/Contexts/AuthContext';

const Home = () => {
    return (
        <>
            {/* <Navbar></Navbar> */}

            <Navbar></Navbar>
            <div className="mt-[30px]">
                <EasyCare  />
            </div>
        </>
    );
};


export default Home
