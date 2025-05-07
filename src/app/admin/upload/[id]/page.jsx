"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { upload_images } from "../../../store/slice/adminSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter, useParams } from "next/navigation";
import * as Yup from 'yup';

export default function UploadImages() {
    const params = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error, image } = useSelector((state) => state.admin);
    const [adminToken, setAdminToken] = useState(null);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("admin_token"));
        if (!token) {
            router.push("/admin/login");
        } else {
            setAdminToken(token);
        }
    }, [router, dispatch]);

    const validationSchema = Yup.object({
        image_link: Yup.string().url().required("Event Link is required")
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const send_data = {
            ...values,
            event_id: Number(params.id),
            token: adminToken
        };
        await dispatch(upload_images(send_data));
        setSubmitting(false);
        resetForm();
        router.refresh();
        router.push("/admin/events");
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Upload Event Image</h1>
    
          <Formik
            initialValues={{
              image_link: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Image Link</label>
                  <Field name="image_link" className="border p-2 w-full rounded" />
                  <ErrorMessage name="image_link" component="div" className="text-red-500 text-sm" />
                </div>
    
                {error && <div className="text-red-500">{error}</div>}
                {image && <div className="text-green-600">Image Upload successfully!</div>}
    
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {isSubmitting || loading ? "Uploading..." : "Upload"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      );
}