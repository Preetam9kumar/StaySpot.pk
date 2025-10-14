import { set } from 'mongoose';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success == false) {
      setError(data.message);
      setLoading(false);
      return;
    } else if(data.success == true) {
      setLoading(false);
    } else if (data.error.code === 11000) {
      setError('User already exists with ' + JSON.stringify(data.error.keyValue));
      setLoading(false);
    } else {
      setError(data.error.message);
      setLoading(false);
    }
  }

  return (
    <div className='max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg'>
      <h1 className='text-3xl text-center font-semibold'>Sign Up</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input type="text" className='border p-3 rounded-lg' placeholder='username' id="username" onChange={handleChange} />
          <input type="email" className='border p-3 rounded-lg' placeholder='email' id="email" onChange={handleChange} />
          <input type="password" className='border p-3 rounded-lg' placeholder='password' id="password" onChange={handleChange} />
          <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-8S0 uppercase disabled:opacity-50 cursor-pointer' disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}</button>
        </form>
        <div className='flex gap-2 mt-5'>
          <p className='text-center'>Already have an account? </p>
          <Link to="/signin" className='text-blue-700 hover:underline cursor-pointer'>Sign In</Link>
        </div>
        {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
      </div>
    )
  }

  export default Signup;