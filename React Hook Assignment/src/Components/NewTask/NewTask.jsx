import React, { useState, useEffect } from "react";
import "./NewTask.css";
import { SnackbarProvider, useSnackbar } from "notistack";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Checkbox,
  Radio,
  FormControlLabel,
  FormLabel,
  FormControl,
  RadioGroup,
  FormGroup,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, setLoading, getData } from "../../Redux/Todo/action";
import { addUser } from "../../Redux/User/action";
import Loading from "../Home/Loading";

const MyNewTask = () => {
  
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("TodoUser"));
    if (user) {
      dispatch(addUser(user));
    }
    dispatch(setLoading(false));
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    status: "todo",
    subTasks: [],
    tags: [],
  });

  const [subTask, setSubtask] = useState({
    title: "",
    status: false,
  });

  const [tags, setTags] = useState([]);

  const handleNewTask = (e) => {
    setNewTaskData({
      ...newTaskData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubTaskArr = (e) => {
    if (subTask.title.length === 0) {
      return;
    }
    setNewTaskData({
      ...newTaskData,
      subTasks: [...newTaskData.subTasks, subTask],
    });
    setSubtask("");
  };
  const handleTags = (e) => {
    // console.log(e);
    if (e.target.checked) {
      if (tags.includes(e.target.value) == false) {
        setTags([...tags, e.target.value]);
        setNewTaskData({
          ...newTaskData,
          tags: [...tags, e.target.value],
        });
      }
    } else {
      setTags(tags.filter((tag) => tag != e.target.value));
      setNewTaskData({
        ...newTaskData,
        tags: tags.filter((tag) => tag != e.target.value),
      });
    }
  };

  const handleAddTodo = (e) => {
    if (newTaskData.title.trim().length === 0) {
      enqueueSnackbar("Title feild is empty", { variant: "error" });
    } else if (newTaskData.tags.length === 0) {
      enqueueSnackbar("Atleast one tag required", { variant: "error" });
    } else {
      const TaskData = {
        ...newTaskData,
        username: user.user.email,
      };

      let res = fetch("http://localhost:8080/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(TaskData),
      })
        .then((res) => res.json())
        .then((res) =>
          enqueueSnackbar("New Todo Creates Successfully", {
            variant: "success",
          })
        );

      dispatch(getData());
      setNewTaskData({
        title: "",
        description: "",
        status: "todo",
        subTasks: [],
        tags: [],
      });
    }
  };

  return (
    <>
      <Loading />{" "}
      <Typography variant="h4" component="p" m="10px auto">
        Add New Todo
      </Typography>
      <div className="newtask_page">
        <div id="newTask_page_section">
          <TextField
            id="outlined-basic"
            label="Todo title"
            variant="outlined"
            size="small"
            name="title"
            value={newTaskData.title}
            onChange={(e) => handleNewTask(e)}
          />
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            name="description"
            value={newTaskData.description}
            onChange={(e) => handleNewTask(e)}
          />
        </div>
        <div id="newTask_page_section">
          <Box component="div" className="small_flex_box">
            <TextField
              id="outlined-basic"
              label="Sub task"
              variant="outlined"
              size="small"
              name="title"
              onChange={(e) =>
                setSubtask({
                  title: e.target.value,
                  status: false,
                })
              }
            />
            <Button
              variant="contained"
              onClick={(e) => {
                handleSubTaskArr(e);
              }}
            >
              {" "}
              Add{" "}
            </Button>
          </Box>

          <Box component="div">
            {newTaskData.subTasks.map((task) => (
              <Box component="div" display="flex" alignItems="center">
                <Checkbox />
                <Typography component="p">{task.title}</Typography>
                <IconButton aria-label="delete">
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </div>
        <div id="newTask_page_section">
          <Box component="div" display="flex" alignItems="center">
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Todo Status
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="todo"
                name="status"
                onChange={(e) => handleNewTask(e)}
              >
                <FormControlLabel
                  value="todo"
                  control={<Radio />}
                  label="Todo"
                />
                <FormControlLabel
                  value="progress"
                  control={<Radio />}
                  label="In Progress"
                />
                <FormControlLabel
                  value="done"
                  control={<Radio />}
                  label="Done"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box component="div">
            <FormGroup>
              <FormLabel id="demo-radio-buttons-group-label">
                Todo Tags
              </FormLabel>
              <FormControlLabel
                control={<Checkbox />}
                label="Official"
                name="tag"
                value="Official"
                onChange={(e) => handleTags(e)}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Personal"
                name="tag"
                value="Personal"
                onChange={(e) => handleTags(e)}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Others"
                name="tag"
                value="Others"
                onChange={(e) => handleTags(e)}
              />
            </FormGroup>
          </Box>
        </div>
        <Button
          variant="contained"
          onClick={(e) => {
            handleAddTodo(e);
          }}
        >
          <h2>Add Todo</h2>
        </Button>
      </div>
    </>
  );
};

export const NewTask = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <MyNewTask />
    </SnackbarProvider>
  );
};
