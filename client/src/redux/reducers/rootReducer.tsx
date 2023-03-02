import { combineReducers } from "redux";
import userReducer from "./userReducer";
import dailyReducer from "./dailyReducer";

const rootReducer = combineReducers({
    userReducer, dailyReducer
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;