import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskToServer,
  deleteTaskFromServer,
  getTasksFromServer,
  updateTaskFromServer,
} from "../../redux/taskSlice";
import axios from "axios";
import UserProfile from "../UserProfile/UserProfile";
import TaskList from "../TaskList/TaskList";
import TaskModal from "../TaskModel/TaskModel";
import "./home.css";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    taskName: "",
    description: "",
    completed: false,
    userId: undefined,
  });
  const [editedTask, setEditedTask] = useState({
    id: null,
    taskName: "",
    description: "",
  });
  const [modal, setModal] = useState({ modalStatus: false });
  const [filter, setFilter] = useState("all");

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    });
  }, [tasks, filter]);

  function getCookies(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const id = parts.pop().split(";").shift();
      setTask((prev) => ({ ...prev, userId: Number(id) }));
    }
  }

  const addTask = useCallback(() => {
    if (!task.taskName.trim() || !task.description.trim()) return;
    dispatch(addTaskToServer(task));
    setTask((prev) => ({
      ...prev,
      taskName: "",
      description: "",
      completed: false,
    }));
  }, [task, dispatch]);

  const deleteTask = useCallback(
    (id) => {
      dispatch(deleteTaskFromServer(id));
    },
    [dispatch]
  );

  const updateTask = useCallback(() => {
    dispatch(updateTaskFromServer(editedTask));
    setModal({ modalStatus: false });
  }, [dispatch, editedTask]);

  const markTaskComplete = useCallback(
    (id) => {
      const taskToUpdate = tasks.find((item) => item._id === id);
      if (taskToUpdate) {
        dispatch(
          updateTaskFromServer({
            ...taskToUpdate,
            completed: !taskToUpdate.completed,
          })
        );
      }
    },
    [tasks, dispatch]
  );

  const openModal = useCallback(
    (id) => {
      const taskToEdit = tasks.find((item) => item._id === id);
      if (taskToEdit) {
        setEditedTask({
          id: taskToEdit._id,
          taskName: taskToEdit.taskName,
          description: taskToEdit.description,
        });
      }
      setModal({ modalStatus: true });
    },
    [tasks]
  );

  const closeModal = useCallback(() => {
    setModal({ modalStatus: false });
  }, []);

  useEffect(() => {
    getCookies("id");
    getUsers();
  }, []);

  useEffect(() => {
    if (task.userId) {
      dispatch(getTasksFromServer(task.userId));
    }
  }, [task.userId, dispatch]);

  async function getUsers() {
    const response = await axios.get("http://localhost:2000/api/users");
    setUsers(response.data);
  }

  const currentUser = users.find((u) => u.id === task.userId);

  return (
    <div className="home-container">
      <div className="task-app">
        <h1 className="app-title">Todo List</h1>

        <div
          style={{
            position: "fixed",
            right: "20px",
            top: "20px",
            zIndex: 1000,
            maxWidth: "300px",
          }}
        >
          <UserProfile user={currentUser} />
        </div>

        <div className="task-input-wrapper">
          <div className="task-card-input input-card">
            <input
              type="text"
              placeholder="Enter your task..."
              value={task.taskName}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, taskName: e.target.value }))
              }
              className="task-input-field"
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <textarea
              placeholder="Enter task description..."
              value={task.description}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className="task-textarea"
            />
            <button
              onClick={addTask}
              disabled={!task.taskName.trim() || !task.description.trim()}
              className="task-button add-btn"
            >
              <i className="bi bi-plus-circle"></i>
              {loading ? "Adding..." : "Add Task"}
            </button>
            {error && (
              <p className="task-error">
                {error.message || error.error || "Something went wrong"}
              </p>
            )}
          </div>
        </div>

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed ({tasks.filter((item) => item.completed).length})
          </button>
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending ({tasks.filter((item) => !item.completed).length})
          </button>
        </div>

        <div className="task-list">
          <h3 className="list-title">📋 Task List</h3>
          <TaskList
            tasks={filteredTasks}
            openModal={openModal}
            deleteTask={deleteTask}
            markTaskComplete={markTaskComplete}
          />
        </div>

        <TaskModal
          modalStatus={modal.modalStatus}
          editedTask={editedTask}
          setEditedTask={setEditedTask}
          closeModal={closeModal}
          updateTask={updateTask}
          loading={loading}
          error={error}
        />

        {/* <div className="undo-redo">
          <button className="undo-btn">
            <i className="bi bi-arrow-counterclockwise"></i> Undo
          </button>
          <button className="redo-btn">
            <i className="bi bi-arrow-clockwise"></i> Redo
          </button>
        </div> */}
      </div>
    </div>
  );
}
