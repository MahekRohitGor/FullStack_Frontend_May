const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
import { secureFetch } from '@/app/utilities/secureFetch';
import Swal from 'sweetalert2';

export const login = createAsyncThunk('admin/loginAdmin', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/login';

    const response = await secureFetch(url, request_data, 'POST', api_key);
    console.log("response: ", response);
    return response;
});

export const dashboard = createAsyncThunk('admin/dashboard', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/dashboard';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    return response;
});

export const events = createAsyncThunk('admin/events', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/event/list';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    console.log("response: ", response);
    return response;
});

export const create_event = createAsyncThunk('admin/createEvent', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `http://localhost:5000/v1/admin/event/create`;
    const send_data = {
        event_title: request_data.event_title,
        event_desc: request_data.event_desc,
        event_address: request_data.event_address,
        event_price: request_data.event_price,
        total_tickets_avail: request_data.total_tickets_avail,
        event_date: request_data.event_date
    }

    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    return response;
});

export const delete_event = createAsyncThunk('admin/deleteEvent', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `http://localhost:5000/v1/admin/event/delete`;
    const send_data = {
        event_id: request_data.event_id
    }
    console.log("Delete: ", request_data.token);
    const response = await secureFetch(url, send_data, 'DELETE', api_key, request_data.token);
    return response;
});

export const edit_event = createAsyncThunk('admin/editEvent', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `http://localhost:5000/v1/admin/event/edit`;
    const send_data = {
        event_id: request_data.event_id,
        event_title: request_data.event_title,
        event_desc: request_data.event_desc,
        event_address: request_data.event_address,
        event_price: request_data.event_price,
        total_tickets_avail: request_data.total_tickets_avail,
        event_date: request_data.event_date
    }

    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    return response;
});

export const upload_images = createAsyncThunk('admin/imageUpload', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `http://localhost:5000/v1/admin/event/upload`;
    const send_data = {
        event_id: request_data.event_id,
        image_link: request_data.image_link
    }
    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    return response;
});

export const logout = createAsyncThunk('products/logout', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `http://localhost:5000/v1/admin/logout`;

    const response = await secureFetch(url, {}, 'POST', api_key, token);
    return response;
});

const initialState = {
    admin: null,
    token: null,
    dashboard_data: null,
    event: null,
    created_event: null,
    edited_event: null,
    image: null,
    error: null,
    loading: false,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.admin = action.payload.data.adminInfo;
                    state.token = action.payload.data.admin_token;
                    localStorage.setItem("admin_token", JSON.stringify(action.payload.data.admin_token));
                    state.error = null;
                } else {
                    state.user = null;
                    state.token = null;
                    state.error = action.payload?.message || "Login failed";
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(dashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(dashboard.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.dashboard_data = action.payload.data;
                    state.error = null;
                } else {
                    state.user = null;
                    state.token = null;
                    state.error = action.payload?.message || "Login failed";
                }
            })
            .addCase(dashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(events.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(events.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.event = action.payload.data;
                    state.error = null;
                } else {
                    state.error = action.payload?.message || "Event List failed";
                }
            })
            .addCase(events.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(create_event.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(create_event.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.created_event = action.payload.data;
                    state.error = null;
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Event Create Success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    state.error = action.payload?.message || "Create Event failed";
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Event Create Error",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .addCase(create_event.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Event Create Error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }).addCase(delete_event.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(delete_event.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.error = null;
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Event Delete Success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    state.error = action.payload?.message || "Delete failed";
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Event Delete Error",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .addCase(delete_event.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Event Delete Error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }).addCase(edit_event.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(edit_event.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.edited_event = action.payload.data;
                    state.error = null;
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Event Edit Success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    state.error = action.payload?.message || "Edit failed";
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Event Edit Error",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .addCase(edit_event.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Event Edit Error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }).addCase(upload_images.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(upload_images.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.image = action.payload.data;
                    state.error = null;
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Upload Image Success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    state.error = action.payload?.message || "Image Upload failed";
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Upload Image Error",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .addCase(upload_images.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Upload Image Error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }).addCase(logout.pending, (state) => {
                            state.loading = true;
                            state.error = null;
                        })
                        .addCase(logout.fulfilled, (state, action) => {
                            state.dashboard_data = null;
                            state.event = null;
                            state.created_event = null;
                            state.edited_event = null;
                            state.admin = null;
                            state.token = null;
                            state.image = null;
                            state.loading = false;
                            state.error = null;
                            localStorage.removeItem('admin_token');
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "LOGOUT SUCCESS",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        })
                        .addCase(logout.rejected, (state, action) => {
                            state.loading = false;
                            state.error = action.error.message;
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: "LOGOUT ERROR",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        })
    }

});

export default adminSlice.reducer;