const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
import { secureFetch } from '@/app/utilities/secureFetch';

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

const initialState = {
    admin: null,
    token: null,
    dashboard_data: null,
    event: null,
    created_event: null,
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
                } else {
                    state.error = action.payload?.message || "Create Event failed";
                }
            })
            .addCase(create_event.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(delete_event.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(delete_event.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.error = null;
                } else {
                    state.error = action.payload?.message || "Delete failed";
                }
            })
            .addCase(delete_event.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(edit_event.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(edit_event.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.error = null;
                } else {
                    state.error = action.payload?.message || "Edit failed";
                }
            })
            .addCase(edit_event.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }

});

export default adminSlice.reducer;