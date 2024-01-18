import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../api/Data";
import { AppThunk } from "../store";
import { callDataApi } from "../../utils/ApiFunctions";

export interface RadarListState {
  radars: api.Radar[];
  isLoading: boolean;
}

interface FetchRadarListResult {
  data: api.Radar[];
}

function startLoading(state: RadarListState): void {
  state.isLoading = true;
}

function stopLoading(state: RadarListState): void {
  state.isLoading = false;
}

const initialState: RadarListState = { radars: [], isLoading: false };

const radarListSlice = createSlice({
  name: "radarlist",
  initialState,
  reducers: {
    getRadarsStart: startLoading,
    getRadarsCompleted: stopLoading,
    getRadarList: (
      state,
      action: PayloadAction<FetchRadarListResult>,
    ): void => {
      state.radars = action.payload.data;
      state.isLoading = false;
    },
  },
});

export const { getRadarsStart, getRadarsCompleted, getRadarList } =
  radarListSlice.actions;

export const fetchRadarList =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(getRadarsStart());

    const result = await callDataApi((baseUrl) =>
      // todo: implement paging here
      api.RadarApiFactory(undefined, baseUrl).radarGet(),
    );

    // TODO: error check

    dispatch(
      getRadarList({
        data: result.data,
      }),
    );
  };

export const radarListSliceReducer = radarListSlice.reducer;
