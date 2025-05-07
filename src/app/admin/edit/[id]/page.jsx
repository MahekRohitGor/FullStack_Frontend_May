"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { edit_event } from "../../../store/slice/adminSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function CreateEventPage() {
    const params = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error, edited_event } = useSelector((state) => state.admin);
    const [adminToken, setAdminToken] = useState(null);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("admin_token"));
        if (!token) {
            router.push("/admin/login");
        } else {
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
            setAdminToken(token);
        }
    }, [router, dispatch]);

    const validationSchema = Yup.object({
        event_title: Yup.string().required("Event Title is required"),
        event_price: Yup.number().required("Price is required").positive("Price must be positive"),
        event_desc: Yup.string().required("Description is required"),
        event_address: Yup.string().required("Address is required"),
        total_tickets_avail: Yup.number().required("Total Available Tickets is required"),
        event_date: Yup.date().required("Date is Required")
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const send_data = {
            ...values,
            event_id: Number(params.id),
            token: adminToken
        };
        await dispatch(edit_event(send_data));
        setSubmitting(false);
        resetForm();
        router.refresh();
        router.push("/admin/dashboard");
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
            <Formik
                initialValues={{
                    event_title: "",
                    event_price: "",
                    event_desc: "",
                    event_address: "",
                    total_tickets_avail: "",
                    event_date: ""
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Event Title</label>
                            <Field name="event_title" className="border p-2 w-full rounded" />
                            <ErrorMessage name="event_title" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Event Price</label>
                            <Field name="event_price" type="number" className="border p-2 w-full rounded" />
                            <ErrorMessage name="event_price" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Description</label>
                            <Field as="textarea" name="event_desc" className="border p-2 w-full rounded" />
                            <ErrorMessage name="event_desc" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Event Address</label>
                            <Field name="event_address" className="border p-2 w-full rounded" />
                            <ErrorMessage name="event_address" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Total Tickets Available</label>
                            <Field name="total_tickets_avail" className="border p-2 w-full rounded" />
                            <ErrorMessage name="total_tickets_avail" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Event Date</label>
                            <Field name="event_date" type="datetime-local" className="border p-2 w-full rounded" />
                            <ErrorMessage name="event_date" component="div" className="text-red-500 text-sm" />
                        </div>

                        {error && <div className="text-red-500">{error}</div>}
                        {edited_event && <div className="text-green-600">Event Updated successfully!</div>}

                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {isSubmitting || loading ? "Updating..." : "Update Event"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );

}