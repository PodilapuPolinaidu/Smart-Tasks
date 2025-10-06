
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const getTasksFromServer = createAsyncThunk(
  "tasks/getTasksFromServer",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:2000/api/tasks/getTasks/${id}`
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const addTaskToServer = createAsyncThunk(
  "tasks/addTaskToServer",
  async (obj, thunkAPI) => {
    const { taskName, description, completed, userId } = obj;
    try {
      const response = await axios.post(
        "http://localhost:2000/api/tasks/addTask",
        {
          taskName,
          description,
          completed,
          userId,
        }
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
export const deleteTaskFromServer = createAsyncThunk(
  "tasks/deleteTaskFromServer",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`http://localhost:2000/api/tasks/deleteTask/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updateTaskFromServer = createAsyncThunk(
  "tasks/updateTaskFromServer",
  async (task, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:2000/api/tasks/updateTask/${task?.id || task?._id}`,
        task
      );
      return response.data.task;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasksFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(addTaskToServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTaskToServer.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTaskToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteTaskFromServer.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTaskFromServer.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateTaskFromServer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // .addCase(markTaskCompleteFromServer.fulfilled, (state, action) => {
    //   state.loading = false;
    //   console.log(action.payload);
    //   const index = state.tasks.findIndex(
    //     (item) => item._id === action.payload._id
    //   );
    //   if (index !== -1) {
    //     state.tasks[index] = action.payload;
    //   }
    // })
    // .addCase(markTaskCompleteFromServer.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });
  },
});

export default taskSlice.reducer;
