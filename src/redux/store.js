import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./features/tasks/taskSlice";

export const store = configureStore({
  reducer: {
    // 'tasks' is the name of this state slice in the store
    // Any component can access it via: state.tasks
    tasks: taskReducer,
  },
});
