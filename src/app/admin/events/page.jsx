"use client"
import { useDispatch, useSelector } from 'react-redux';
import { events, delete_event } from '../../store/slice/adminSlice';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import Link from 'next/link';

export default function Events() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error, event } = useSelector((state) => state.admin);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('admin_token'));
        if (!token) {
            router.push('/admin/login');
            return;
        }
        dispatch(events(token));
    }, [dispatch, router]);

    const handleDelete = async (event_id) => {
        const token = JSON.parse(localStorage.getItem("admin_token"));
        if (!token) {
            router.push('/admin/login');
            return;
        }
        const requested_data = {
            event_id: event_id,
            token: token
        }
        await dispatch(delete_event(requested_data));
        dispatch(events(token));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-blue-500 text-xl">LOADING...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    if (!event || event.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">No Data found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Admin Event Listing</h1>
            <Link className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/admin/create`}>Create Events</Link>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                {event.map((data) => (
                    <div key={data.event_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{data.event_title}</h2>
                            <p className="text-gray-600 mb-2">{data.event_desc}</p>
                            <p className="text-blue-600 font-bold mb-4">Date: {data.event_date}</p>
                            <p className="text-blue-600 font-bold mb-4">Time: {data.event_time}</p>
                            <p className="text-blue-600 font-bold mb-4">Location: {data.event_address}</p>
                            <p className="text-blue-600 font-bold mb-4">Rs. {data.event_price}</p>
                            <p className="text-blue-600 font-bold mb-4">Total Tickets: {data.total_tickets_avail}</p>
                            <p className="text-blue-600 font-bold mb-4">Available Tickets: {data.total_tickets_avail - data.total_tickets_sold}</p>
                            <button className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-300 mb-5" onClick={() => handleDelete(data.event_id)}>Delete</button>
                            <Link className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/admin/edit/${data.event_id}`}>Edit Events</Link>
                            <Link className="ml-4 mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/admin/upload/${data.event_id}`}>Upload Event Images</Link>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}