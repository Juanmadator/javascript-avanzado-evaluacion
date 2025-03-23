//creo un array para las tareas
let tasksArray=[];
window.addEventListener("load", () => {
  let tasks = document.querySelectorAll(".tasks__task");

    tasks.forEach(el=>{
        getTaskContent(el);
    })

    console.log(tasksArray)

  let { dateEnd } = fillFormInputs();
  const today = new Date();
  dateEnd.value = formatDate(today);

  tasks.forEach((el) => {
    el.addEventListener("click", () => getTaskContent(el));
  });
});

const getTaskContent = (e) => {
  let task = e;
  let taskTitle = task.children[0].textContent;
  let taskDescription = task.children[1].textContent;
  let taskDate = task.children[2].textContent;
  let taskState = task.children[3].textContent;

  task = {
    taskTitle,
    taskDescription,
    taskDate,
    taskState,
  };

  fillFormInputs(task);

  //guardo cada tarea en el array
  tasksArray.push(task);
};

const fillFormInputs = (object = {}) => {
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let state = document.getElementById("state");
  let dateEnd = document.getElementById("date-end");

  let { taskTitle, taskDescription, taskDate, taskState } = object;

  if (taskDate) {
    dateEnd.value = formatDate(new Date(taskDate));
  }

  if (taskDate && taskDescription && taskState && taskTitle) {
    title.value = taskTitle;
    description.value = taskDescription;
    dateEnd.value = taskDate;
    state.value = taskState;
  }

  return { title, description, state, dateEnd };
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};
