"use client"
import { useDispatch, useSelector } from 'react-redux';
import { dashboard } from '../../store/slice/adminSlice';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import Link from "next/link";

export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error, dashboard_data } = useSelector((state) => state.admin);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('admin_token'));
        if (!token) {
            router.push('/admin/login');
            return;
        }
        if (localStorage.getItem('token')) {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "User Already Login",
                showConfirmButton: false,
                timer: 1500
            });
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
            <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

            <Link className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/admin/events`}>Manage Events</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                {dashboard_data.map((data) => (
                    <div key={data.event_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{data.event_title}</h2>
                            <p className="text-gray-600 mb-2">{data.event_desc}</p>
                            <p className="text-blue-600 font-bold mb-4">Total Attendees: {data.total_attendees}</p>
                            <p className="text-blue-600 font-bold mb-4">Total Revenue in Rs. {data.total_revenue_from_tickets_sold}</p>
                            <p className="text-blue-600 font-bold mb-4">Total Tickets: {data.total_tickets_avail}</p>
                            <p className="text-blue-600 font-bold mb-4">Available Tickets: {data.remaining_tickets}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

