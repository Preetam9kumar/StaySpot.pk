import React from 'react'
import { Link } from 'react-router-dom';
function Header() {
    return (
        <header className='bg-slate-200 shadow-md absolute w-full top-0'>
            <div className='flex justify-between items-center mx-auto max-w-6xl p-3'>
                <Link to="/"><div className='text-lg text-yellow-900 text-sm sm:text-xl font-extrabold font-sans text-shadow-2xs text-shadow-amber-900'>StaySpot.pk</div></Link>
                <form className='bg-slate-100 p-3 rounded-lg flex items-center space-x-2'>
                    <input type="text" placeholder="Search..." className='bg-transparent focus:outline-none w-24 sm:w-64' />
                </form>
                <ul className='flex space-x-4'>
                    <Link to="/"><li className='hidden sm:inline text-slate-700 hover:underline'>Home</li></Link>
                    <Link to="/about"><li className='hidden sm:inline text-slate-700 hover:underline'>About</li></Link>
                    <Link to="/signin"><li className='text-slate-700 hover:underline'>Sign In</li></Link>
                    <Link to="/signup"><li className='text-slate-700 hover:underline'>Sign Up</li></Link>
                </ul>
            </div>
        </header>
    )
}

export default Header