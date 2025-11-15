import React from "react";
import TaskForm from "./components/TaskForm"; // Form to add new tasks
import TaskList from "./components/TaskList"; // List to display and manage tasks

const App = () => {
  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen my-0 lg:my-6 p-4 sm:p-6 bg-[#F9F8F6] rounded-lg space-y-4 ">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold p-2 text-center">
        Task Manager
      </h1>
      <TaskForm />
      <TaskList />
    </div>
  );
};

export default App;
