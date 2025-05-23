import { getFormInputs, verifytaskTitle, showMessage } from "./index.js";

//funcion para actualizar la tarea (basada en el titulo)
export const updateTask = (event) => {
  event.preventDefault();
  const updatedTask = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,
    dateEnd: document.querySelector("#date-end").value,
    state: document.querySelector("#state").value,
  };

  const taskToEdit = JSON.parse(localStorage.getItem("taskToEdit"));
  const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  //la busco por el titulo y la actualizo con los nuevos valores
  const updatedTasks = allTasks.map((task) => {
    if (task.title === taskToEdit.taskTitle) {
      return { ...task, ...updatedTask };
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  localStorage.removeItem("taskToEdit");

  showMessage("taskCreated");

  setInterval(() => {
    window.location.reload();
  }, 500);
};

//funcion para eliminar la tarea
export const deleteTask = (titulo) => {
  const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const updatedTasks = allTasks.filter((task) => task.title !== titulo);

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  localStorage.removeItem("taskToEdit"); // limpiar

  showMessage("taskDeleted");

  setTimeout(() => {
    window.location.reload(); 
  }, 100);
};

//funcion para crear la tarea
export const createTask = (event) => {
  event.preventDefault();

  const { title, state, description, dateEnd } = getFormInputs();

  let exists = verifytaskTitle(title.value); // esta función debería verificar si el título ya existe en localStorage
  let added = false;
  if (!exists) {
    const validStates = ["completado", "en-progreso", "pendiente"];
    const isValidState = validStates.includes(state.value.toLowerCase());

    if (
      title.value &&
      state.value &&
      description.value &&
      dateEnd.value &&
      isValidState
    ) {
      const task = {
        id: crypto.randomUUID(),
        title: title.value,
        description: description.value,
        dateEnd: dateEnd.value,
        state: state.value,
      };
      const currentTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      currentTasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(currentTasks));
      added = true;
    }

    if (!added) {
      showMessage("errorCreate");
    } else {
      showMessage("taskCreated");
      clearForm();
      setTimeout(() => {
        window.location.reload();  
      }, 500);
    }
  }
};

//funcion para cargar en el dom los elementos dinamicamente
export const createTaskElement = (title, description, date, state) => {
  const div = document.createElement("div");
  div.classList.add("task");
  const article = document.createElement("article");
  article.classList.add("tasks__task");

  const h4 = document.createElement("h4");
  h4.textContent = title;

  const p = document.createElement("p");
  p.classList.add("tasks__task-description");
  p.textContent = `${description}`;

  const dateSpan = document.createElement("span");
  dateSpan.textContent = date;
  const deleteSpam = document.createElement("span");
  deleteSpam.textContent = "Eliminar";
  deleteSpam.classList.add("eliminarBtn");
  const stateSpan = document.createElement("span");
  stateSpan.classList.add(state.toLowerCase(), "state");
  stateSpan.textContent = state.charAt(0).toUpperCase() + state.slice(1);

  article.appendChild(h4);
  article.appendChild(p);
  article.appendChild(dateSpan);
  article.appendChild(stateSpan);

  div.appendChild(article);
  div.appendChild(deleteSpam);
  return div;
};

export const clearForm = () => {
  let { title, state, description } = getFormInputs();
  title.value = "";
  state.value = "";
  description.value = "";
};

//funcion para obtener imagen aletoria de rickymotty
export const getRandomCharacters = async (count = 5) => {
  try {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    const data = await response.json();
    const total = data.info.count;
    const randomIds = Array.from(
      { length: count },
      () => Math.floor(Math.random() * total) + 1
    );

    const charactersResponse = await fetch(
      `https://rickandmortyapi.com/api/character/${randomIds.join(",")}`
    );
    const charactersData = await charactersResponse.json();

    const characters = Array.isArray(charactersData)
      ? charactersData
      : [charactersData];

    characters.forEach((char) => {
      const img = document.createElement("img");
      img.classList.add("rickAndMorty");
      img.title = "Imagen de rick y morty";
      img.src = char.image;
      img.alt = char.name;
      img.style.width = "50px";
      img.style.margin = "10px";
      document.body.appendChild(img);
    });
  } catch (error) {
    console.error("Error al obtener personajes:", error);
  }
};
