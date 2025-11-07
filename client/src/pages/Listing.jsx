import React from 'react'
import {useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function Listing() {
    const params = useParams();
    useEffect(() => {
        const getListing = async () => {
            const listingId = params.listingId;
            const res = await axios.get(`/api/listing/get/${listingId}`);
            const data = res.data;
            if (!data) {
                console.log(data.message);
                return;
            }
            console.log(data)
        }
        getListing();
    }, [])
    return (
        <div>Welcom Listing there ... </div>
    )
}

export default Listing