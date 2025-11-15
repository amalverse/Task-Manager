import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// Import all actions needed to modify tasks in Redux store
import {
  toggleComplete, // Action to mark task complete/incomplete
  editTask, // Action to update task text
  deleteTask, // Action to remove task
  setSearchFilter, // Action to update search filter
  setStatusFilter, // Action to update status filter
} from "../redux/features/tasks/taskSlice";

const TaskList = () => {
  //Getting data FROM Redux store using useSelector()
  const { tasks, filter } = useSelector((state) => state.tasks);

  //Sending actions TO Redux store using useDispatch()
  const dispatch = useDispatch();

  // Local state for Edit Task
  const [editId, setEditId] = useState(null); // null = no task being edited
  const [editText, setEditText] = useState(""); // text being typed in edit field

  // Filter tasks based on search and status
  const filteredTasks = tasks
    // FIRST FILTER: By status (all/pending/complete)
    .filter((task) => {
      // If status is "all", show all tasks
      if (filter.status === "all") return true;
      // If status is "pending", show only incomplete tasks (completed === false)
      if (filter.status === "pending" && !task.completed) return true;
      // If status is "complete", show only completed tasks (completed === true)
      if (filter.status === "complete" && task.completed) return true;
    })
    // SECOND FILTER: By search text (must contain search query)
    .filter((task) => {
      // Convert both to lowercase for case-insensitive comparison
      // Check if task text includes the search filter
      return task.text.toLowerCase().includes(filter.search.toLowerCase());
    });

  //handleEdit
  const handleEdit = (id, text) => {
    // Save which task is being edited
    setEditId(id);
    // Pre-fill the edit input with current task text
    setEditText(text);
  };

  //handleEditSave
  const handleEditSave = (id) => {
    // Only save if new text is not empty or just whitespace
    if (editText.trim()) {
      // Dispatch the editTask action
      dispatch(editTask({ id, newText: editText.trim() }));
      // Exit edit mode by clearing edit state
      setEditId(null);
      setEditText("");
    }
  };

  return (
    <div>
      {/* Users type here to search tasks by text.*/}
      <input
        type="text"
        placeholder="Search Text"
        value={filter.search} // Display current search filter from Redux
        onChange={(e) => dispatch(setSearchFilter(e.target.value))} // Update Redux store as user types
        className="w-full p-2 border rounded mb-4"
      />

      {/* STATUS FILTER BUTTONS */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {/* Map over each status option to create a button */}
        {["all", "pending", "complete"].map((status) => (
          <button
            key={status}
            onClick={() => dispatch(setStatusFilter(status))} // Update Redux filter
            // Highlight the currently selected filter button
            className={`flex-1 sm:flex-none text-sm sm:text-base px-3 py-2 rounded border text-center min-w-[90px]  ${
              filter.status === status ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {/* Capitalize the first letter of status text */}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* TASK LIST */}

      <ul className="space-y-2">
        {/* Show message if no tasks match the current filters */}
        {filteredTasks.length === 0 && <p>No tasks found.</p>}
        {/* Loop through each filtered task and display it */}
        {filteredTasks.map((task) => (
          <li
            key={task.id} // React needs unique key for list items
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded"
          >
            {/* LEFT DIV: Task Checkbox & Text */}
            <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
              {/* Checkbox to mark task complete/incomplete */}
              <input
                type="checkbox"
                checked={task.completed} // Show checked if task is completed
                onChange={() => dispatch(toggleComplete(task.id))} // Update Redux on change
                className="shrink-0 mt-1 sm:mt-0 w-4 h-4"
                aria-label={`Mark ${task.text} as ${
                  task.completed ? "incomplete" : "complete"
                }`}
              />
              {/* Display task text */}
              <div className="flex-1 min-w-0">
                {editId === task.id ? (
                  // EDIT MODE: Show input field
                  <input
                    type="text"
                    value={editText} // Display text being edited
                    onChange={(e) => setEditText(e.target.value)} // Update as user types
                    className="border rounded px-2 py-1 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
                    aria-label="Edit task"
                  />
                ) : (
                  // DISPLAY MODE: Show task text & struck-through if completed
                  <span
                    className={`block text-sm sm:text-base wrap-break-words ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT DIV: Action Buttons */}
            <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4">
              {/* Conditional button: Show "Save" OR "Edit"*/}
              {editId === task.id ? (
                // SAVE BUTTON: Visible during edit mode
                <button
                  onClick={() => handleEditSave(task.id)} // Save changes to Redux
                  className="text-green-600 hover:underline text-sm sm:text-base px-2 py-1"
                >
                  Save
                </button>
              ) : (
                // EDIT BUTTON: Visible in normal display mode
                <button
                  onClick={() => handleEdit(task.id, task.text)} // Enter edit mode
                  className="text-blue-600 hover:underline text-sm sm:text-base px-2 py-1"
                >
                  Edit
                </button>
              )}

              {/* DELETE BUTTON: Always visible*/}
              <button
                onClick={() => dispatch(deleteTask(task.id))} // Remove task from Redux
                className="text-red-600 hover:underline text-sm sm:text-base px-2 py-1"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

/* 
TASKLIST COMPONENT:
1.Retrieves tasks from Redux store via useSelector
2.Filters and displays tasks based on status and search
3.Allows users to complete, edit, and delete tasks
4.Dispatches actions to update the Redux store
*/
