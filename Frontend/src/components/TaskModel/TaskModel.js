import React from "react";

const TaskModal = React.memo(
  ({
    modalStatus,
    editedTask,
    setEditedTask,
    closeModal,
    updateTask,
    loading,
    error,
  }) => {
    if (!modalStatus) return null;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="update-card-input input-card">
            <div className="modal-header">
              <h3>Update Task</h3>
              <button className="close-btn" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter your task..."
              value={editedTask.taskName}
              onChange={(e) =>
                setEditedTask((prev) => ({ ...prev, taskName: e.target.value }))
              }
              className="task-input-field"
            />

            <textarea
              placeholder="Enter task description..."
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="task-textarea"
            />

            <div className="modal-actions">
              <button onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={updateTask}
                disabled={loading || !editedTask.taskName.trim()}
                className="update-btn"
              >
                {loading ? "Updating..." : "Update Task"}
              </button>
            </div>

            {error && (
              <p className="task-error">
                {error.message || error.error || "Something went wrong"}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default TaskModal;
