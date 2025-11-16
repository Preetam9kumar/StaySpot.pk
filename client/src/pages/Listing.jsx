import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux'
import { FaShare, FaBath, FaChair, FaMapMarkerAlt, FaParking, FaBed } from 'react-icons/fa'
import Contact from '../components/Contact';

function Listing() {
    const params = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        setError(null);
        const getListing = async () => {
            try {
                setLoading(true);
                const listingId = params.listingId;
                const res = await axios.get(`/api/listing/get/${listingId}`);
                const data = res.data;
                if (!data) {
                    setError(data.message);
                    return;
                }
                setLoading(false);
                setListing(data)
            } catch (error) {
                setLoading(false);
                setError(error);
            }
        }
        getListing();
    }, [params.listingId])

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setTimeout(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        },0)
    }
    return (
        <main className='mt-18'>
            {loading &&
                <p className='text-center my-7 text-2xl'>Loading . . . </p>
            }
            {error && (
                <p className='text-center my-7 text-2xl'>Something went wrong!</p>
            )}
            {listing && !error && !loading && (
                <div>
                    <Swiper navigation modules={[Navigation]}>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[550px] bg-cover bg-center" style={{ backgroundImage: `url(${url})` }}>

                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare className='text-slate-500' onClick={handleCopy} />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied
                        </p>
                    )}
                    <div className='flex flex-col max-w-4xl mx-auto p-3 gap-6'>
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.offer ? ('<span className="line-through">'+listing.regularPrice+'</span>'+ listing.discountPrice.toLocaleString('en-US')) : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && '/ month'}
                        </p>
                        <p className='flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>
                        <div className='flex gap-2'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {
                                listing.offer && (
                                    <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                        ${+listing.regularPrice - +listing.discountPrice} Off
                                    </p>
                                )
                            }
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1 ? `${listing.bedrooms} beds ` : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1 ? `${listing.bathrooms} baths ` : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking Spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished '}
                            </li>

                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button onClick={() => setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                                Contact landlord
                            </button>
                        )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )}
        </main>
    )
}

export default Listing