"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { prev_purchase } from '../../../store/slice/userSlice';
import Link from 'next/link';
import QRCodeGenerator from '@/app/components/QRCode';

export default function PreviousOrders() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error, prevPurchase } = useSelector((state) => state.user);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            router.push('/user/login');
            return;
        }
        dispatch(prev_purchase(token));
    }, [dispatch, router]);

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!prevPurchase) return <div className="text-center py-8">Purchase History not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Purchase History</h1>
            <Link className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/user/home`}>Home Page</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                {prevPurchase.map((prev) => (
                    <div key={prev.purchase_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-center mb-4">
                                <QRCodeGenerator text={prev.qrcode} />
                            </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{prev.event_title}</h2>
                            <p className="text-gray-600 mb-2">{prev.event_desc}</p>
                            <p className="text-gray-600 mb-2">CODE: {prev.qrcode}</p>
                            <p className="text-gray-600 mb-2">Status: {prev.purchase_status}</p>
                            <p className="text-blue-600 font-bold mb-4">Date: {prev.event_date}</p>
                            <p className="text-blue-600 font-bold mb-4">Time: {prev.event_time}</p>
                            <p className="text-blue-600 font-bold mb-4">Payment Type: {prev.payment_type}</p>
                            <p className="text-blue-600 font-bold mb-4">Rs. {prev.amount}</p>
                            <p className="text-blue-600 font-bold mb-4">Quantity: {prev.qty}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}