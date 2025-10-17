import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firbase.js'
import {useDispatch} from 'react-redux';
import {signInSuccess} from '../redux/user/userSlice.js';

function OAuth() {
  const dispatch = useDispatch();
  const handleGoogleClick = async () =>{
    try{
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await fetch('/api/auth/google',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
      });
      const data = await res.json()
      console.log(data)
      dispatch(signInSuccess(data));
    }catch(error){
      console.log('could not sign in with google'+error);
    }
  }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google </button>
  )
}

export default OAuth;