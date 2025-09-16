import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate=useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(false);
    const [language, setLanguage] = useState('En');

  return (
    <div className='sticky top-0 flex items-center justify-between text-sm py-4 mb-5 bg-white z-10 shadow-md'>
        <h1 className='w-44 cursor-pointer font-bold text-2xl text-green-600 ml-6'>SmartDrive</h1>
        <ul className="hidden md:flex items-start gap-5 font-medium">
            {/* Navigation buttons removed */}
        </ul>
        <div className="flex items-center gap-6">
            {token ? (
                <div className="flex items-center gap-2 cursor-pointer group relative">
                    <img className="w-8 rounded-full" src="" alt="profilePic" />
                    <img className="w-2.5" src="" alt="dropDown" />
                    <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-300">
                        <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                            <p
                                onClick={() => navigate('smartdrive-frontend/my-profile')}
                                className="hover:text-black cursor-pointer"
                            >
                                My Profile
                            </p>
                            <p
                                onClick={() => navigate('smartdrive-frontend/my-appointments')}
                                className="hover:text-black cursor-pointer"
                            >
                                My Appointments
                            </p>
                            <p
                                onClick={() => setToken(false)}
                                className="hover:text-black cursor-pointer"
                            >
                                Logout
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => navigate('/smartdrive-frontend/login')}
                    className="border-2 border-green-600 text-green-600 font-bold px-8 py-3 rounded-full transition duration-300 hover:bg-green-600 hover:text-white"
                >
                    Sign In
                </button>
            )}
            <div className="relative mr-6">
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    className="bg-white border border-gray-300 rounded p-2 text-sm opacity-70"
                >
                    <option value="En">English</option>
                    <option value="Si">Sinhala</option>
                    <option value="Ta">Tamil</option>
                </select>
            </div>
        </div>
    </div>
  )
}

export default Navbar