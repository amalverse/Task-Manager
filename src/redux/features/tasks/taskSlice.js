import { createSlice } from "@reduxjs/toolkit";

// Load tasks array from local storage
const loadTasksFromLocalStorage = () => {
  try {
    // Get the "tasks" item from browser's local storage
    const data = localStorage.getItem("tasks");
    // If data exists, convert JSON string to object; otherwise return empty array
    return data ? JSON.parse(data) : [];
  } catch {
    // If something goes wrong (parsing error), return empty array
    return [];
  }
};

// Save tasks array to local storage
const saveTasksToLocalStorage = (tasks) => {
  try {
    // Convert tasks array to JSON string and store in browser's localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    // If saving fails, log the error to console for debugging
    console.error("Error saving tasks to local storage:", error);
  }
};

// Create a Redux slice with initial state and reducers
export const taskSlice = createSlice({
  // Name of this state slice (used internally by Redux)
  name: "tasks",
  // Initial state of this state slice
  initialState: {
    // Load saved tasks from local storage, or start with empty array
    tasks: loadTasksFromLocalStorage(),
    // Filter state to track what user is searching/filtering for
    filter: {
      status: "all", // Show all tasks by default
      search: "", // No search filter initially
    },
  },

  reducers: {
    //Add a new task
    addTask: (state, action) => {
      // action.payload = { id, text, completed } from TaskForm component
      state.tasks.push(action.payload);
      // Save to localStorage so tasks persist after page refresh
      saveTasksToLocalStorage(state.tasks);
    },

    //Delete a task
    deleteTask: (state, action) => {
      // action.payload = the ID of task to delete
      // Keep all tasks EXCEPT the one with matching ID
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      // Save updated tasks to localStorage
      saveTasksToLocalStorage(state.tasks);
    },

    //Toggle a task's "completed" status
    toggleComplete: (state, action) => {
      // action.payload = ID of task to toggle
      // Find the task with this ID
      const taskToToggle = state.tasks.find(
        (task) => task.id === action.payload
      );
      // If task found, flip its completed status
      if (taskToToggle) {
        taskToToggle.completed = !taskToToggle.completed;
        // Save to localStorage for persistence
        saveTasksToLocalStorage(state.tasks);
      }
    },

    //Edit a task
    editTask: (state, action) => {
      // Destructure to get id and newText from action payload
      const { id, newText } = action.payload;
      // Find the task that needs to be updated
      const taskToUpdate = state.tasks.find((task) => task.id === id);
      // If task exists, update its text
      if (taskToUpdate) {
        taskToUpdate.text = newText;
        // Save changes to localStorage
        saveTasksToLocalStorage(state.tasks);
      }
    },

    //Filter Tasks
    setStatusFilter: (state, action) => {
      // action.payload = "all" | "pending" | "complete"
      state.filter.status = action.payload;
      // Note: We don't save filter to localStorage, only tasks
    },

    //Filter Tasks By Search
    setSearchFilter: (state, action) => {
      // action.payload = the search text typed by user
      state.filter.search = action.payload;
      // Note: We don't save filter to localStorage, only tasks
    },
  },
});

// Export actions
export const {
  addTask, // Action to add a new task
  deleteTask, // Action to delete a task
  toggleComplete, // Action to mark task complete/incomplete
  editTask, // Action to edit a task's text
  setStatusFilter, // Action to change status filter (all/pending/complete)
  setSearchFilter, // Action to change search filter text
} = taskSlice.actions;

// Export the reducer function
export default taskSlice.reducer;

/*
REDUX SLICE - Task Management Logic-A "slice" is a piece of the Redux store that handles one domain (tasks).
This file defines:
1. The initial state (data structure) of tasks
2. Reducers (functions) that modify the state
3. Actions that components dispatch to trigger state changes
*/
