import { Input } from '@/components/ui/input';
import {Button} from "@/components/ui/button.tsx";

const Login = () => {
    return (
        <>
            <div className="flex items-center justify-center w-full px-30 py-20 h-[100vh] bg-white">
                <div className="flex flex-col w-1/2 items-start justify-start">
                    <div>
                        <h1 className="text-[44px] font-bold text-green-600">EasyCare</h1>
                        <h3 className="text-[28px] font-semibold">Getting Started with Appointment</h3>
                    </div>

                    <div className="flex flex-col items-start mt-10 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="fullName">Full Name</label>
                            <Input id="fullName" placeholder="Enter your Full Name" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email">Email Address</label>
                            <Input id="email" placeholder="Enter your Email" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password">Password</label>
                            <Input id="password" type="password" placeholder="Enter your password" />
                        </div>
                    </div>
                    <div className="flex w-full justify-center items-start">
                        <Button>Get started</Button>
                    </div>
                </div>

                <div className="flex justify-center w-1/2 items-center">
                    <img src="/Doctor.png" alt="Doctor illustration" />
                </div>
            </div>
        </>
    );
};

export default Login;
