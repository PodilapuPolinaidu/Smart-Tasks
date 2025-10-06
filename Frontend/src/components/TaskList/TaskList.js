import React from "react";
import TaskCard from "../TaskCard/TaskCard";

const TaskList = React.memo(
  ({ tasks, openModal, deleteTask, markTaskComplete }) => {
    if (tasks.length === 0) {
      return (
        <div className="no-tasks">
          <i className="bi bi-inbox"></i>
          <p>No tasks found</p>
        </div>
      );
    }

    return (
      <div className="tasks-grid">
        {tasks.map((task, index) => (
          <TaskCard
            key={task._id}
            task={task}
            index={index}
            openModal={openModal}
            deleteTask={deleteTask}
            markTaskComplete={markTaskComplete}
          />
        ))}
      </div>
    );
  }
);

export default TaskList;
