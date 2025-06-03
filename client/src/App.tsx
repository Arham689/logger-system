import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import './App.css';

function App() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 

    // const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setError('');

        if (!isSignIn) {
            // if (password !== confirmPassword) {
            //   setError("Passwords don't match");
            //   // toast.error("Passwords don't match");
            //   return;
            // }

            // try {
            //     const response = await axios.post(
            //         `${base_url}/api/auth/signUp`,
            //         {
            //             username,
            //             email,
            //             password,
            //         },
            //         { withCredentials: true }
            //     );
            //     Cookies.set('token', response.data.token, { expires: 7, secure: true });
            //     navigate('/department');
            //     // toast.success(response.data.message);
            // } catch (err) {
            //     console.log(err);
            //     setError(err.response?.data?.message || 'Server error');
            //     // toast.error(err.response?.data?.message || 'Server error');
            // }
            console.log(email, username, password);
        } else {
            // try {
            //     const response = await axios.post(
            //         `${base_url}/api/auth/logIn`,
            //         {
            //             email,
            //             password,
            //         },
            //         { withCredentials: true }
            //     );
            //     //  , {withCredentials : true , headers : { "Content-Type" : "application/json" }}
            //     Cookies.set('token', response.data.token, { expires: 7, secure: true });
            //     navigate('/department');
            //     // toast.success(response.data.message);
            // } catch (err) {
            //     console.log(err);
            //     setError(err.response?.data?.message || 'Server error');
            //     // toast.error(err.response?.data?.message || 'Server error');
            // }

            console.log(email, password);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black from-50% to-[#1F4FD8] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-light text-white mb-2">
                       {
                        !isSignIn ? <>Create new <span className="text-blue-400 font-medium">Account</span></> : <>Welcome <span className="text-blue-400 font-medium">Back</span></>
                       }
                        
                    </h1>
                    
                </div>

                {/* Form Container */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-900/30 border border-red-700/50 p-3 text-red-400 text-sm">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        {!isSignIn && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Username</label>
                                <div className="relative">
                                    <User
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Email</label>
                            <div className="relative">
                                <Mail
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                                    placeholder="name@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <Lock
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
                                    size={18}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 mt-6 cursor-pointer text-center"
                        >
                            {isSignIn ? 'Login' : 'Create Account'}
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignIn(!isSignIn);
                                setError('');
                                setUsername('');
                                setEmail('');
                                setPassword('');
                            }}
                            className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                        >
                            {isSignIn ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
