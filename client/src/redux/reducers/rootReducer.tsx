import { combineReducers } from "redux";
import dailyReducer from "./dailyReducer";

const rootReducer = combineReducers({
    dailyReducer
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;