import { createTask, updateTask } from "./functions.js";

//creo un array para las tareas
let tasksArray = [];
window.addEventListener("load", () => {
  //selecciono todas las tareas
  let tasks = document.querySelectorAll(".tasks__task");
  let taskTitle = document.getElementById('title');

  taskTitle.addEventListener('input', verifytaskTitle);
  //con esto añado el contenido de cada tarea al array de tasks
  tasks.forEach((el) => {
    getTaskContent(el);
  });

  let { dateEnd } = fillFormInputs();
  const today = new Date();
  dateEnd.value = formatDate(today);

  //funcion para rellenar los datos de una tarea en el form para poder editarla
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

  //guardo cada tarea en el array

  let taskFind = tasksArray.find((el) => {
    return el.taskTitle == task.taskTitle;
  });

  if (!taskFind) {
    tasksArray.push(task);
    console.log("añadida primera vez");
  } else if(taskFind) {
    fillFormInputs(task);
    console.log("Mostrando datos en el form");
    console.log(tasksArray.length);
    disableCreate();
  }
};

const disableCreateBtn = (valor = true) => {
  let btnCreate = document.getElementById('createTask');
  if (valor) {
  btnCreate.setAttribute('disabled', true);
  } else {
    
  btnCreate.removeAttribute('disabled');
  }
}

const disableUpdateBtn = (valor = true) => {
  let btnUpdate = document.getElementById('editTask');
  if (valor) {
    btnUpdate.setAttribute('disabled', true);
  } else {
    
    btnUpdate.removeAttribute('disabled');
  }
}


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


/*
Verifica si el titulo existe
Si existe desabilida la posibilidad de crear
*/
const verifytaskTitle = (e) => {
  let currentValue = e.target.value;

  let titleFind = tasksArray.find(el => {
    return el.taskTitle == currentValue;
  })

  if (titleFind) {
    disableCreateBtn(true);
    disableUpdateBtn(false);

  } else {
    disableCreateBtn(false);
    disableUpdateBtn(true);

  }

};