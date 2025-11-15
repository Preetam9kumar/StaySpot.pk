import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {FaSearch} from 'react-icons/fa'


function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState(" ");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() =>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    return (
        <header className='bg-slate-200 shadow-md absolute w-full top-0'>
            <div className='flex justify-between items-center mx-auto max-w-6xl p-3'>
                <Link to="/"><div className=' text-yellow-900 text-sm sm:text-xl font-extrabold font-sans text-shadow-2xs text-shadow-amber-900'>StaySpot.pk</div></Link>
                <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center space-x-2'>
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <button type='submit'><FaSearch className='text-slate-600 cursor-pointer'/></button>
                </form>
                <ul className='flex space-x-4'>
                    <Link to="/"><li className='hidden sm:inline text-slate-700 hover:underline'>Home</li></Link>
                    <Link to="/about"><li className='hidden sm:inline text-slate-700 hover:underline'>About</li></Link>
                    <Link to="/profile">
                        {currentUser ? (
                            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                        ) : (
                            <li className='text-slate-700 hover:underline'>Sign In</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header