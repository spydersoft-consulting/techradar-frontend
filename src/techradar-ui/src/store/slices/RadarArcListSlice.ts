import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../api/Data";
import { AppThunk } from "../store";
import { callDataApi } from "../../utils/ApiFunctions";

export interface RadarArcListState {
  arcs: api.RadarArc[];
  radarId: number;
  isLoading: boolean;
}

interface FetchRadarArcListResult {
  data: api.RadarArc[];
  radarId: number;
}

function startLoading(state: RadarArcListState): void {
  state.isLoading = true;
}

function stopLoading(state: RadarArcListState): void {
  state.isLoading = false;
}

const initialState: RadarArcListState = {
  arcs: [],
  radarId: 0,
  isLoading: false,
};

const radarArcListSlice = createSlice({
  name: "arclist",
  initialState,
  reducers: {
    getRadarArcsStart: startLoading,
    getRadarArcsCompleted: stopLoading,
    getRadarArcsList: (state, action: PayloadAction<FetchRadarArcListResult>): void => {
      state.arcs = action.payload.data;
      state.radarId = action.payload.radarId;
      state.isLoading = false;
    },
  },
});

export const { getRadarArcsStart, getRadarArcsCompleted, getRadarArcsList } = radarArcListSlice.actions;

export const fetchRadarArcList =
  (radarId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(getRadarArcsStart());

    const result = await callDataApi((baseUrl) => api.RadarApiFactory(undefined, baseUrl).radarIdArcsGet(radarId));

    // TODO: error check

    dispatch(
      getRadarArcsList({
        data: result.data,
        radarId: radarId,
      }),
    );
  };

export const radarArcListSliceReducer = radarArcListSlice.reducer;
