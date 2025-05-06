const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
import { secureFetch } from '@/app/utilities/secureFetch';

export const login = createAsyncThunk('products/loginAdmin', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/login';

    const response = await secureFetch(url, request_data, 'POST', api_key);
    return response;
});

export const dashboard = createAsyncThunk('products/dashboard', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/dashboard';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    return response;
});

const initialState = {
    admin: null,
    token: null,
    dashboard_data: null,
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
                    state.token = action.payload.data.user_token;
                    localStorage.setItem("admin_token", JSON.stringify(action.payload.data.user_token));
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
            })
    }

});

export default adminSlice.reducer;