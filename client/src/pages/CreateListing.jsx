import { useRef, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';

function CreateListing() {
    const [files, setFiles] = useState([]);
    const { currentUser } = useSelector(state => state.user);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        sale: false,
        rent: false,
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountPrice: 0,
        userRef: currentUser._id
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                        ? Number(value)
                        : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const multipartForm = new FormData();

            Object.keys(formData).forEach(key => {
                if (key !== "imageUrls") multipartForm.append(key, formData[key]);
            });

            // append the selected images (files state)
            for (let i = 0; i < files.length; i++) {
                multipartForm.append("imageUrls", files[i]);
            }

            if (files.length < 1) {
                setError("Please upload at least 1 image.");
                return;
            }

            if (formData.regularPrice < formData.discountPrice) {
                setError('Discouted price must be less then regular price.');
                return;
            }
            setLoading(true);

            const res = await axios.post("/api/listing/create", multipartForm, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data) {
                setLoading(false)
                console.log("Listing Created", res.data);
                alert('Listing Created Successfully');
            } else {
                setLoading(false)
                alert('Error creating Listing ! ');
            }
        } catch (error) {
            setLoading(false)
            alert('Failed to Create Listing. ')
        }
    }

    const handleRemoveImage = (index) => {
        setFiles(prev => {
            const arr = Array.from(prev);
            arr.splice(index, 1);
            return arr;
        });
    };

    return (
        <main className='mt-18 p-3 max-w-4xl mx-auto'>
            <div className='text-3xl font-semibold text-center my-7'>Create Listing</div>
            <form className='flex flex-col sm:flex-row gap-6'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id="name" maxLength='62' minLength='10' value={formData.name} onChange={handleChange} required />
                    <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id="description" required value={formData.description} onChange={handleChange} />
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id="address" required value={formData.address} onChange={handleChange} />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="sale" checked={formData.sale} onChange={handleChange} />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="rent" checked={formData.rent} onChange={handleChange} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="parking" checked={formData.parking} onChange={handleChange} />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="furnished" checked={formData.furnished} onChange={handleChange} />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="offer" checked={formData.offer} onChange={handleChange} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="number" className='p-3 border border-gray-300 rounded-lg' id="bedrooms" min='1' max='10' required value={formData.bedrooms} onChange={handleChange} />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" className='p-3 border border-gray-300 rounded-lg' id="bathrooms" min='1' max='10' required value={formData.bathrooms} onChange={handleChange} />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" className='p-3 border border-gray-300 rounded-lg' id="regularPrice" min='1' max='500000' required value={formData.regularPrice} onChange={handleChange} />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'> PKR / month</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" className='p-3 border border-gray-300 rounded-lg' id="discountPrice" min='1' max='500000' required value={formData.discountPrice} onChange={handleChange} />
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                                <span className='text-xs'>PKR / month</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images: <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span></p>
                    <div className='flex gap-4'>
                        <input className='p-3 border border-gray-300 rounded w-full' type="file" onChange={(e) => setFiles(e.target.files)} id="images" accept='image/*' multiple />
                    </div>
                    {files && Array.from(files).length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-2">
                            {Array.from(files).map((file, idx) => (
                                <div
                                    key={idx}
                                    className="relative w-24 h-24 border rounded overflow-hidden"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={handleFormSubmit} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {loading ? 'Creating Listing...' : 'Create Listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
    );
}

export default CreateListing