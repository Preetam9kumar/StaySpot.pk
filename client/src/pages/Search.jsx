import { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom'
import axios from 'axios';
import ListingItem from '../components/ListingItem';

function Search() {
    const navigate = useNavigate()
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    }); 
    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id ==='sale'){
            setSidebardata({...sidebardata,type: e.target.id});
        }
        if(e.target.id ==='searchTerm'){
            setSidebardata({...sidebardata,searchTerm: e.target.value});
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebardata({...sidebardata,[e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,});
        }
        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({...sidebardata, sort, order});
        }
    }; 

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking',sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort',sidebardata.sort);
        urlParams.set('order',sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(()=>{
        const urlParams =new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl){
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl ==='true'? true:false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true'? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }
        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await axios.get(`/api/listing/get?${searchQuery}`);
            const data = await res.data;
            setListing(data)
            setLoading(false);
        }
        fetchListings();
    },[location.search])
    console.log(sidebardata);
    return (
        <div className='mt-18 flex flex-col md:flex-row'>
            <div className='p-7 border-slate-300 border-b-2 md:border-r-2 md:min-h-screen md:w-1/4 lg:w-1/5'>
                <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <input type='text' onChange={handleChange} id='searchTerm' placeholder='Search...' className='border rounded px-3 w-full' />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Type: </label>
                        <div className='flex gap-2'>
                            <input onChange={handleChange} checked={sidebardata.type === 'all'} type="checkbox" id='all' className='w-5' />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={sidebardata.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={sidebardata.type === 'sale'}/>
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={sidebardata.offer}/>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities: </label>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={sidebardata.parking}/>
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={sidebardata.furnished}/>
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <select id='sort_order' className='border rounded px-3' defaultValue={'createdAt_desc'} onChange={handleChange}>
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-full'>
                        Search
                    </button>
                </form>
            </div>
            <div className=''>
                <h1 className='text-3xl font-semibold p-3 text-slate-700 mt-5'>Listing results :</h1>
                {!loading && listing === null && (
                    <p className='text-xl text-slate-700 '>No Listing Found !</p>
                )}
                {loading && (
                    <p className='text-xl text-slate-700 text-center w-full'>Loading . . . </p>
                )}
                {!loading && listing && listing.map((listing)=>(
                    <ListingItem key={listing._id} listing ={listing}/>
                ))}
            </div>
        </div>
    )
}

export default Search