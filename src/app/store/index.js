"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import adminReducer from "./slice/adminSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,
            admin: adminReducer
        },
    });
}