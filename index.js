const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

const ToDoModel = require("./Models/ToDo");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/get", (req, res) => {
  ToDoModel.find()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  // ToDoModel.findByIdAndUpdate({ _id: id }, { done: true })
  //   .then((response) => res.json(response))
  //   .catch((error) => res.json(" error", error));
  ToDoModel.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).json;
        ({ error: "item not found" });
      }

      todo.done = !todo.done;

      return todo.save();
    })
    .then((updatedTodo) => {
      // Respond with the updated item
      res.json(updatedTodo);
    })
    .catch((error) => {
      // Handle any errors that occur during the process
      res.status(500).json({ error: "Internal server error" });
    });
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  ToDoModel.findByIdAndDelete({ _id: id })
    .then((response) => res.json(response))
    .catch((error) => res.json(" error", error));
});

app.post("/add", (req, res) => {
  const task = req.body.task;
  ToDoModel.create({
    task: task,
  })
    .then((response) => res.json(response))
    .catch((error) => res.json(" error", error));
});

// app.listen(PORT, () => {
//   console.log("running");
// });
