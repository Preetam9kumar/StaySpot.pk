import React from 'react'

function CreateListing() {
    return (
        <main className='mt-18 p-3 max-w-4xl mx-auto'>
            <div className='text-3xl font-semibold text-center my-7'>CreateListing</div>
            <form className='flex flex-col sm:flex-row'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id="name" maxLength='62' minLength='10' required />
                    <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id="description" required />
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id="address" required />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="sale" />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="rent" />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="parking" />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="furnished" />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type="checkbox" id="office" />
                            <span>Office</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="number" className='p-3 border border-gray-300 rounded-lg' id="bedrooms" min='1' max='10' required />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" className='p-3 border border-gray-300 rounded-lg' id="bathrooms" min='1' max='10' required />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" className='p-3 border border-gray-300 rounded-lg' id="reg-price" min='1' max='500000' required />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'> PKR / month</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" className='p-3 border border-gray-300 rounded-lg' id="disc-price" min='1' max='500000' required />
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
                        <input className='p-3 border border-gray-300 rounded w-full' type="file" id="images" accept='image/*' multiple/>
                        <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
                    </div>
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    Create Listing 
                </button>
                </div>
            </form>
        </main>
    )
}

export default CreateListing