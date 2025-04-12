import { createTask, updateTask } from "./functions.js";

//creo un array para las tareas
export let tasksArray = [];
window.addEventListener("load", () => {
  //selecciono todas las tareas
  const filterSelect = document.getElementById("filter");
  let tasks = document.querySelectorAll(".tasks__task");
  let taskTitle = document.getElementById("title");

  let btnCreate = document.getElementById("createTask");
  let btnUpdate = document.getElementById("editTask");
  if (btnCreate && btnUpdate && taskTitle) {
    btnCreate.addEventListener("click", createTask);
    btnUpdate.addEventListener("click", updateTask);
    taskTitle.addEventListener("input", verifytaskTitle);
  }

  //con esto añado el contenido de cada tarea al array de tasks
  tasks.forEach((el) => {
    getTaskContent(el);
  });

  let { dateEnd } = fillFormInputs();
  const today = new Date();
  if (dateEnd) {
    dateEnd.value = formatDate(today);
  }

  //funcion para rellenar los datos de una tarea en el form para poder editarla
  tasks.forEach((el) => {
    el.addEventListener("click", () => getTaskContent(el));
  });

  if (filterSelect) {
    filterSelect.addEventListener("change", filterTasks);
  }

  getWeather();
});

function getWeather() {
  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      //llamada a una api para obtener la localizacion
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();

      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
			  data.address.county;
		 
      console.log("Ciudad del usuario:", city);

      //aqui uso la api para obtener el clima en la ciudad del usuario
      fetch(`https://wttr.in/${city}?format=3`)
        .then((res) => res.text())
		  .then((weather) => {
			document.getElementById("ciudad").textContent = city;
			document.getElementById("ciudad").classList.remove("spinner");
			document.getElementById("ciudad").textContent = weather;
          console.log("Clima:", weather);
        });
    },
    function (error) {
      console.error("Error al obtener ubicación:", error.message);
    }
  );
}

export const getTaskContent = (e) => {
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
	  
	  console.log(tasksArray)
  } else if (taskFind) {
    fillFormInputs(task);
    disableBtn(true, "createTask");
  }

  return task;
};

// segun el primer parametro se deshabilitará o no y el segundo parámetro es el boton que quiero deshabilitar

const disableBtn = (valor = true, btn) => {
  let btnSelected = document.getElementById(btn);
  if (valor) {
    btnSelected.setAttribute("disabled", true);
  } else {
    btnSelected.removeAttribute("disabled");
  }
};

const fillFormInputs = (object = {}) => {
  let { title, description, state, dateEnd } = getFormInputs();

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

export const getFormInputs = () => {
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let state = document.getElementById("state");
  let dateEnd = document.getElementById("date-end");

  return {
    title,
    description,
    state,
    dateEnd,
  };
};
/*
Verifica si el titulo existe
Si existe desabilida la posibilidad de crear
*/
export const verifytaskTitle = (titleParam, e = null) => {
  let currentValue = titleParam || e?.target?.value;

  console.log(currentValue);

  let titleFind = tasksArray.find((el) => {
    return el.taskTitle == currentValue;
  });
  if (titleFind) {
    disableBtn(true, "createTask");
    disableBtn(false, "editTask");

    //MOSTRAR ERROR DE QUE YA EXISTE
    showMessage("taskExists");
    return true;
  } else {
    disableBtn(false, "createTask");
    disableBtn(true, "editTask");
  }
};

export const showMessage = (id) => {
  document.getElementById(`${id}`).style.display = "block";
  setTimeout(() => {
    document.getElementById(`${id}`).style.display = "none";
  }, 2500);
};

const filterTasks = (e) => {
  let value = e.target.value;
  const tasks = document.querySelector(".tasks").children;

  for (const task of tasks) {
    const span = task.querySelectorAll("span")[1];
    if (span && span.classList.contains(value)) {
      task.style.display = "block";
    } else if (value === "todas") {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  }
};
