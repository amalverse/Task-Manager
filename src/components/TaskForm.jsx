import React, { useState } from "react";
import { useDispatch } from "react-redux";
// Import the addTask action created by taskSlice
import { addTask } from "../redux/features/tasks/taskSlice";
// nanoid generates unique IDs for each task
import { nanoid } from "nanoid";

const TaskForm = () => {
  const [text, setText] = useState(""); // Local state for input field

  // Access the Redux dispatch function
  const dispatch = useDispatch();

  // Function to handle form submission
  const handleSubmit = (e) => {
    // Prevent browser's default form submission (which would refresh the page)
    e.preventDefault();

    // Don't submit if input is empty or only whitespace
    if (text.trim() === "") return;

    // Dispatch the addTask action to Redux store
    dispatch(
      addTask({
        id: nanoid(), // Generate unique ID for this task
        text: text.trim(), // Task description (remove whitespace)
        completed: false, // Task is not complete when created
      })
    );

    // Clear the input field so user can add another task
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4"
    >
      {/* Input field for typing a new task */}
      <input
        type="text"
        value={text} // Display current value from local state
        onChange={(e) => setText(e.target.value)} // Update local state as user types
        placeholder="Add New Task"
        className="flex-1 w-full text-sm sm:text-base p-2 sm:p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      {/* Button to submit the form and add task to Redux store */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-600 transition-colors w-full sm:w-auto"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;

/*
TASKFORM COMPONENT: Form for adding new tasks
1. Provides an input field for users to type a task
2. Dispatches the addTask action to Redux store when submitted
3. Uses local state (text) for form input
4. Uses Redux dispatch to send data to the global store
*/
