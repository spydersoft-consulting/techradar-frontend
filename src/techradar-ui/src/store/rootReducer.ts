import { combineReducers } from "redux";
import { radarListSliceReducer } from "./slices/RadarListSlice";
import { radarArcListSliceReducer } from "./slices/RadarArcListSlice";
import { radarQuadrantListSliceReducer } from "./slices/RadarQuadrantListSlice";
import { itemListSliceReducer } from "./slices/ItemListSlice";
import { radarTagSliceReducer } from "./slices/RadarTagSlice";
import { radarViewSliceReducer } from "./slices/RadarViewSlice";

export const rootReducer = combineReducers({
  radarlist: radarListSliceReducer,
  arclist: radarArcListSliceReducer,
  quadlist: radarQuadrantListSliceReducer,
  itemlist: itemListSliceReducer,
  radartags: radarTagSliceReducer,
  radarview: radarViewSliceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
