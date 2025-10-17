import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';
function Signin() {
  const [formData, setFormData] = useState({});
  const {error,loading} = useSelector((state)=> state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    dispatch(signInStart());
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    console.log(res);
    const data = await res.json();
    if (data.success == false) {
      dispatch(signInFailure(data.message))
    }
    dispatch(signInSuccess(data))
    navigate('/');
  }catch(error){
    dispatch(signInFailure(error.message));
  }
  }

  return (
    <div className='flex items-center justify-center flex-col h-[100vh] bg-slate-50 lg:mt-5'>
      <form className='flex flex-col gap-6 shadow-2xl shadow-gray-600 rounded-2xl  w-3/4 lg:w-1/3 mx-auto p-6 bg-slate-100' onSubmit={handleSubmit}>
        <h1 className='text-3xl text-center font-semibold py-8'>Sign In</h1>
        <input type="text" className='border p-3 rounded-lg' placeholder='username' id="username" onChange={handleChange} />
        <input type="email" className='border p-3 rounded-lg' placeholder='email' id="email" onChange={handleChange} />
        <input type="password" className='border p-3 rounded-lg' placeholder='password' id="password" onChange={handleChange} />
        <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-8S0 uppercase disabled:opacity-50 cursor-pointer' disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}</button>
        <OAuth/>
        <div className='flex gap-2 mt-5'>
          <p className='text-center'>You don't have an account? </p>
          <Link to="/signup" className='text-blue-700 hover:underline cursor-pointer'>Sign Up</Link>
        </div>
        {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
      </form>
    </div>
  )
}

export default Signin;