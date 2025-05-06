"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { event_by_id, purchase_ticket } from '../../../store/slice/userSlice';
import Link from 'next/link';
import Image from '../../../components/Image';

export default function EventDetails() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useDispatch();
    const { id } = params;
    const [quantity, setQuantity] = useState(1);
    const { loading, error, event } = useSelector((state) => state.user);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            router.push('/user/login');
            return;
        }
        dispatch(event_by_id({ id, token }));
    }, [dispatch, router, id]);

    const handle_purchase_ticket = async (id) => {
        if(!paymentMethod){
            alert("Please Select Payment Method");
            return;
        }

        const token = JSON.parse(localStorage.getItem('token'));

        const data_to_send = {
            event_id: id,
            payment_type: paymentMethod,
            qty: quantity,
            token: token
        }
        await dispatch(purchase_ticket(data_to_send));

        setTimeout(()=>{
            router.push("/user/home");
        }, [3000]);
    }

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!event) return <div className="text-center py-8">Event not found</div>;

    const images = event.images ? event.images.split(',') : [];

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{event.event_title}</h1>
                <Link
                    href="/user/home"
                    className="text-blue-600 hover:underline"
                >
                    Back to Events
                </Link>
            </div>

            <div className="mb-8">
                <Image images={images} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700">{event.event_desc}</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Date</h3>
                            <p>{event.event_date}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Time</h3>
                            <p>{event.event_time}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Price</h3>
                            <p>Rs. {event.event_price}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Tickets</h3>
                            <p>{event.total_tickets_avail - event.total_tickets_sold} available</p>
                        </div>
                    </div>

                    <div className="flex items-center mb-6">
                        <span className="mr-4 text-gray-700">Quantity:</span>
                        <button
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            className="w-10 h-10 bg-gray-200 rounded-l-lg flex items-center justify-center text-xl font-bold"
                            disabled={quantity <= 1}>
                            -
                        </button>
                        <div className="w-16 h-10 bg-gray-100 flex items-center justify-center border-t border-b border-gray-200">
                            {quantity}
                        </div>
                        <button
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="w-10 h-10 bg-gray-200 rounded-r-lg flex items-center justify-center text-xl font-bold">
                            +
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="cod">Cash on Delivery</option>
                            <option value="debit">Debit Card</option>
                            <option value="credit">Credit</option>
                            <option value="upi">UPI</option>
                        </select>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium mt-4" onClick={() => handle_purchase_ticket(id)}>
                        Book Tickets
                    </button>
                </div>
            </div>
        </div>
    );
}