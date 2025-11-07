import { useRef, useState } from "react";
import axios from "axios";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function Profile() {
  const fileInputRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: currentUser.password,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser.avatar);
  const { loading, error } = useSelector((state) => state.user);
  const [showListingError, setShowListingError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState(null);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const data = new FormData();
      if (currentUser.username !== formData.username) {
        data.append("username", formData.username);
      }
      if (currentUser.email !== formData.email) {
        data.append("email", formData.email);
      }
      if (formData.password?.trim().length > 3) {
        data.append("password", formData.password);
      }
      if (avatarFile) data.append("avatar", avatarFile);

      const res = await axios.put(`/api/user/update/${currentUser._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.user;
      if (res.data.success == false) {
        dispatch(updateUserFailure(res.data.message));
        return;
      }
      setUpdateSuccess(true);
      dispatch(updateUserSuccess(updatedUser));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`);
      const deletedUser = res.data;
      console.log(deletedUser);
      if (deletedUser.success === false) {
        dispatch(deleteUserFailure(deletedUser.message));
        return;
      }
      dispatch(deleteUserSuccess(deletedUser));
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }

  }

  const handleSingOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await axios.get(`/api/auth/signout`);
      const signedOut = res.data;
      console.log(signedOut);
      if (signedOut.success === false) {
        dispatch(signOutUserFailure(signedOut.message));
        return;
      }
      dispatch(signOutUserSuccess(signedOut));
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await axios.get(`/api/user/listings/${currentUser._id}`);
      const data = await res.data;
      if (!data) {
        setShowListingError(true)
        return
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  }

  const handleListingDelete =async (listingId) => {
    try{
      const res = await axios.delete(`/api/listing/delete/${listingId}`);
      const data = res.data;
      if(!data){
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing)=>{listing._id !== listingId}));
    }catch(error){
      console.log(error.message);
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto mt-18">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            setAvatarFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
          }}
          className="hidden"
          accept="image/*"
        />

        <img
          onClick={() => fileInputRef.current.click()}
          src={previewUrl || "https://via.placeholder.com/150"}
          alt="Profile"
          className={`rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 ${loading ? "opacity-50" : ""
            }`}
        />

        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Username"
        />
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Email"
        />
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Password"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 text-center" to="/create-listing">Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSingOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : " "}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? "User updated successfully!" : " "}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingError ? 'Error showing listings' : ''}</p>
      {userListings && userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
              <Link to={`/listing/${listing._id}`} >
                <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain" />
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase" >Delete</button>
                <Link to={`/update-listing/${listing._id}`}><button className="text-green-700 uppercase">Edit</button></Link>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}
