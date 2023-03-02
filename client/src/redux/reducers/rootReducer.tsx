import { combineReducers } from "redux";
import userReducer from "./userReducer";
import dailyReducer from "./dailyReducer";
import eventReducer from "./eventReducer";

const rootReducer = combineReducers({
    userReducer, dailyReducer, eventReducer
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;