import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            
            if (response.data.success) {
                // Store token and user info
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                toast.success('Login successful!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        toast.info('Google sign-in coming soon!');
    };

    const handleGithubLogin = () => {
        toast.info('GitHub sign-in coming soon!');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            
            <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-700">
                <Link to="/" className="flex items-center gap-2">
                    <div className="text-blue-500 text-2xl">📝</div>
                    <span className="text-xl font-bold">NoteX</span>
                </Link>
                <a href="#" className="text-slate-300 hover:text-white transition text-sm">Contact Support</a>
            </nav>

        
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-12">
                <div className="w-full max-w-md">
                   
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50 shadow-xl">
                        
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                                <FaLock className="text-blue-500 text-2xl" />
                            </div>
                        </div>

                        
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                            <p className="text-slate-400 text-sm">Organize your thoughts privately.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            
                            <div className='mb-4'>
                                <label className='block text-sm font-medium mb-2'>Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <FaEnvelope size={16} />
                                    </div>
                                    <input 
                                        type="email" 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        value={email}
                                        required 
                                        placeholder='name@example.com'
                                        className='w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-white' 
                                    />
                                </div>
                            </div>

                            
                            <div className='mb-4'>
                                <div className="flex items-center justify-between mb-2">
                                    <label className='block text-sm font-medium'>Password</label>
                                    <a href="#" className="text-blue-400 hover:text-blue-300 text-xs">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <FaLock size={16} />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        required 
                                        placeholder='••••••••'
                                        className='w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-white' 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            
                            <button 
                                className='w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed mt-6'
                                type='submit'
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-slate-600"></div>
                            <span className="text-slate-400 text-xs">Or continue with</span>
                            <div className="flex-1 h-px bg-slate-600"></div>
                        </div>

                        
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={handleGoogleLogin}
                                className='bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-lg hover:bg-slate-700 transition font-medium flex items-center justify-center gap-2'
                            >
                                <FcGoogle size={20} />
                                Google
                            </button>
                            <button 
                                onClick={handleGithubLogin}
                                className='bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-lg hover:bg-slate-700 transition font-medium flex items-center justify-center gap-2'
                            >
                                <FaGithub size={20} />
                                GitHub
                            </button>
                        </div>

                        
                        <p className='mt-6 text-center text-slate-400 text-sm'>
                            Don't have an account? <Link to="/signup" className='text-blue-400 hover:text-blue-300 font-medium'>Sign up</Link>
                        </p>
                    </div>

                    
                    <div className="flex items-center justify-center gap-4 mt-8 text-slate-500 text-xs">
                        <a href="#" className="hover:text-slate-400">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-slate-400">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
