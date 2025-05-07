"use client"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slice/adminSlice';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import Link from "next/link";
import Swal from 'sweetalert2'

export default function LoginForm() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isUserLogin, setUserLogin] = useState(false);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('admin_token'));
        if (token) {
            router.push('/admin/dashboard');
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
            setUserLogin(true);
            return;
        }
    }, [router]);

    const initialValues = {
        email_id: '',
        password_: ''
    };

    const validationSchema = Yup.object({
        email_id: Yup.string().email('Invalid email').required('Email is required'),
        password_: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setError('');
        setSuccess(false);
        try {
            const response = await dispatch(login(values)).unwrap();
            if (response?.code === 200) {
                setSuccess(true);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Login Successful",
                    showConfirmButton: false,
                    timer: 1500
                });
                router.push('/admin/dashboard');
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Something Went Wrong",
                    text: 'Admin Already Login',
                    showConfirmButton: false,
                    timer: 1500
                });
                setError('Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Something Went Wrong",
                text: 'Admin Already Login',
                showConfirmButton: false,
                timer: 1500
            });
            setError('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        <div>
                            <label htmlFor="email_id" className="block text-sm font-medium">Email</label>
                            <Field name="email_id" type="email" className="w-full border p-2 rounded" />
                            <ErrorMessage name="email_id" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="password_" className="block text-sm font-medium">Password</label>
                            <Field name="password_" type="password" className="w-full border p-2 rounded" />
                            <ErrorMessage name="password_" component="div" className="text-red-500 text-sm" />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || isUserLogin}
                            className="w-full mb-5 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-75"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </Form>
                )}
            </Formik>

            <Link className="mt-4 mr-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/user/login`}>Login As User</Link>
        </div>
    );
};