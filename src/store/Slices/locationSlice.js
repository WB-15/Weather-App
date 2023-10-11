import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchLocations = createAsyncThunk("locations", async (value) => {
  const GEODB_API_URL = process.env.GEODB_API_URL || "default_url";
  const X_RapidAPI_Key = process.env.X_RapidAPI_Key || "default_api_key";
  const X_RapidAPI_Host = process.env.X_RapidAPI_Host || "default_host";
  const res = await fetch(
    `${GEODB_API_URL}/cities?minPopulation=10&namePrefix=${value}`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": X_RapidAPI_Key,
        "X-RapidAPI-Host": X_RapidAPI_Host,
      },
    }
  );
  const data = await res.json();
  return data.data;
});

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const initialState = {
  data: [],
  status: STATUSES.IDLE,
  locationDetail: [],
};
const locationSlice = createSlice({
  name: "locationSlice",
  initialState,
  reducers: {
    getLocationDetail(state, action) {
      state.locationDetail.splice(0, 0, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export default locationSlice.reducer;
export const { getLocationDetail } = locationSlice.actions;
