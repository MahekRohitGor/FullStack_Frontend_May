"use client"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slice/userSlice';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Link from "next/link";

const LoginForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
                router.push('/user/home');
            } else {
                setError(response?.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
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
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-5"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </Form>
                )}
            </Formik>

            <Link className="mt-8 mr-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/admin/login`}>Login As Admin</Link>
            <Link className="mt-8 mr-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/user/signup`}>Signup</Link>
        </div>
    );
};

export default LoginForm;