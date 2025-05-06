const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
import { secureFetch } from '@/app/utilities/secureFetch';

export const login = createAsyncThunk('products/loginUser', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/login';

    const response = await secureFetch(url, request_data, 'POST', api_key);
    return response;
});

const initialState = {
    user: null,
    token: null,
    events: null,
    event: null,
    ticket: null,
    prevPurchase: null,
    error: null,
    loading: false,
};

const adminSlice = createSlice({
    name: 'user',
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
                    state.user = action.payload.data.userInfo;
                    state.token = action.payload.data.user_token;
                    localStorage.setItem("token", JSON.stringify(action.payload.data.user_token));
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
            })
    }

});

export default adminSlice.reducer;