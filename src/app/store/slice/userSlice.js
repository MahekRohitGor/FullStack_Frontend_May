const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
import { secureFetch } from '@/app/utilities/secureFetch';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const signup = createAsyncThunk('products/signupUser', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `${baseUrl}/v1/user/signup`;

    const response = await secureFetch(url, request_data, 'POST', api_key);
    return response;
});

export const login = createAsyncThunk('products/loginUser', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `${baseUrl}/v1/user/login`;

    const response = await secureFetch(url, request_data, 'POST', api_key);
    return response;
});

export const event_list = createAsyncThunk('products/eventList', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `${baseUrl}/v1/user/events/list`;

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    return response;
});

export const event_by_id = createAsyncThunk('products/evenId', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `${baseUrl}/v1/user/events/${request_data.id}`;

    const response = await secureFetch(url, {}, 'GET', api_key, request_data.token);
    return response;
});

export const purchase_ticket = createAsyncThunk('products/purchaseTicket', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `${baseUrl}/v1/user/events/purchase`;
    const send_data = {
        qty: request_data.qty,
        payment_type: request_data.payment_type,
        event_id: request_data.event_id
    }

    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    return response;
});

export const prev_purchase = createAsyncThunk('products/prevPurchase', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `${baseUrl}/v1/user/history`;
    console.log("Token: ", token);
    const response = await secureFetch(url, {}, 'GET', api_key, token);
    console.log("Response: ", response);
    return response;
});

export const logout = createAsyncThunk('products/logout', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `${baseUrl}/v1/user/logout`;

    const response = await secureFetch(url, {}, 'POST', api_key, token);
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

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(signup.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(signup.fulfilled, (state, action) => {
            state.loading = false;
            console.log(action.payload.code);
            if (action.payload?.code == 200) {
                state.user = action.payload.data.userInfo;
                state.token = action.payload.data.user_token;
                state.error = null;
            } else {
                state.user = null;
                state.token = null;
                state.error = action.payload?.message || "Signup failed";
            }
        })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(login.pending, (state) => {
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
            }).addCase(event_list.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(event_list.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.events = action.payload.data;
                    state.error = null;
                } else {
                    state.error = action.payload?.message || "List Events failed";
                }
            })
            .addCase(event_list.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(event_by_id.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(event_by_id.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.event = action.payload.data;
                    state.error = null;
                } else {
                    state.error = action.payload?.message || "Event fetch failed";
                }
            })
            .addCase(event_by_id.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(purchase_ticket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(purchase_ticket.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.ticket = action.payload.data;
                    state.error = null;
                } else {
                    state.error = action.payload?.message || "Purchase Ticket failed";
                }
            })
            .addCase(purchase_ticket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(prev_purchase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(prev_purchase.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 200) {
                    state.prevPurchase = action.payload?.data;
                    state.error = null;
                } else {
                    state.prevPurchase = [];
                }
            })
            .addCase(prev_purchase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.events = null;
                state.event = null;
                state.ticket = null;
                state.prevPurchase = null;
                state.user = null;
                state.loading = false;
                state.error = null;
                localStorage.removeItem('token');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }

});

// export const { resetOrder, updateFilters, resetFilters } = prodSlice.actions;
export default userSlice.reducer;