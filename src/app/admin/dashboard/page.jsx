"use client"
import { useDispatch } from 'react-redux';
import { dashboard } from '../../store/slice/adminSlice';
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error, dashboard_data } = useSelector((state) => state.admin);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            router.push('/admin/login');
            return;
        }
        dispatch(dashboard(token));
    }, [dispatch, router]);

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

    if (!dashboard_data || dashboard_data.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">No Data found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Explore Events</h1>

            <Link className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/user/home/order`}>View Order History</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                {events.map((event) => (
                    <div key={event.event_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {firstImage && (
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <img 
                                        src={firstImage} 
                                        alt={event.event_title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{event.event_title}</h2>
                            <p className="text-gray-600 mb-2">{event.event_desc}</p>
                            <p className="text-blue-600 font-bold mb-4">Date: {event.event_date}</p>
                            <p className="text-blue-600 font-bold mb-4">Time: {event.event_time}</p>
                            <p className="text-blue-600 font-bold mb-4">Location: {event.event_address}</p>
                            <p className="text-blue-600 font-bold mb-4">Rs. {event.event_price}</p>
                            <p className="text-blue-600 font-bold mb-4">Total Tickets: {event.total_tickets_avail}</p>
                            <p className="text-blue-600 font-bold mb-4">Available Tickets: {event.total_tickets_avail - event.total_tickets_sold}</p>
                            <Link className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/user/home/${event.event_id}`}>View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

