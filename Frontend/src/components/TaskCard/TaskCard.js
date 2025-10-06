import React from "react";

const TaskCard = ({ task, index, openModal, deleteTask, markTaskComplete }) => (
  <div
    key={task._id}
    className={`task-card ${task.completed ? "completed" : ""} fade-in`}
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="task-content">
      <h4 className="task-title">{task.taskName}</h4>
      <p className="task-description">{task.description}</p>
      <div className="task-status">
        Status:{" "}
        <span className={task.completed ? "completed-text" : "pending-text"}>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>
    </div>

    <div className="actions">
      <button className="action-btn edit-btn" onClick={() => openModal(task._id)}>
        <i className="bi bi-pencil"></i>
      </button>
      <button className="action-btn delete-btn" onClick={() => deleteTask(task._id)}>
        <i className="bi bi-trash"></i>
      </button>
      <button
        className={`action-btn complete-btn ${task.completed ? "completed" : ""}`}
        onClick={() => markTaskComplete(task._id)}
      >
        <i className={`bi ${task.completed ? "bi-arrow-counterclockwise" : "bi-check-circle"}`}></i>
      </button>
    </div>
  </div>
);

export default React.memo(TaskCard);
