import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import axios from 'axios'
import ListingItem from '../components/ListingItem.jsx'
export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await axios.get('/api/listing/get?offer=true&limit=4');
        const data = res.data;
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await axios.get('/api/listing/get?type=rent&limit=4');
        const data = res.data;
        setRentListings(data)
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSaleListings = async () => {
      try {
        const res = await axios.get('/api/listing/get?type=sale&limit=4');
        const data = res.data;
        setSaleListings(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, [])
  return (
    <div className='mt-18'>
      {/* top section */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span> place with ease !
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>StaySpot.pk is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>Let's get started...</Link>
      </div>
      {/* Swiper */}
      <Swiper modules={[Navigation]} navigation>
        {offerListings && offerListings.length>0 && offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover',}} className='h-[500px]'>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* listing results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        { offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2>Recent offers</h2>
              <Link to={'/listing?offer=true'}>
              Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing)=>(
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
         { rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2>Recent places for rent .</h2>
              <Link to={'/listing?type=rent'}>
              Show more places
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing)=>(
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
         { saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2>Recent places for sale</h2>
              <Link to={'/listing?type=sale'}>
              Show more places
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing)=>(
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
