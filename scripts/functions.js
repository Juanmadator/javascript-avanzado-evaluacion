import { getFormInputs, verifytaskTitle, showMessage } from "./index.js";

// Observación: La función updateTask podría beneficiarse de una mejor validación
// y manejo de errores antes de actualizar localStorage
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

  // Observación: La búsqueda por título podría ser problemática si hay títulos duplicados
  // Sugerencia: Usar un ID único para identificar tareas
  const updatedTasks = allTasks.map((task) => {
    if (task.title === taskToEdit.taskTitle) {
      return { ...task, ...updatedTask };
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  localStorage.removeItem("taskToEdit");

  showMessage("taskCreated");

  // Observación: El uso de setInterval para recargar la página no es la mejor práctica
  // Sugerencia: Actualizar el DOM directamente
  setInterval(() => {
    window.location.reload();
  }, 500);
};

// Observación: La función deleteTask podría beneficiarse de una confirmación
// antes de eliminar la tarea
export const deleteTask = (titulo) => {
  const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const updatedTasks = allTasks.filter((task) => task.title !== titulo);

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  localStorage.removeItem("taskToEdit"); // limpiar

  showMessage("taskDeleted");

  // Observación: El uso de setTimeout para recargar la página no es la mejor práctica
  // Sugerencia: Actualizar el DOM directamente
  setTimeout(() => {
    window.location.reload(); 
  }, 100);
};

// Observación: La función createTask podría beneficiarse de una mejor validación
// y manejo de errores
export const createTask = (event) => {
  event.preventDefault();

  const { title, state, description, dateEnd } = getFormInputs();

  // Observación: Sería útil validar que la fecha sea futura
  let exists = verifytaskTitle(title.value);
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
      // Observación: Sería útil añadir un campo createdAt para tracking
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
      // Observación: El uso de setTimeout para recargar la página no es la mejor práctica
      // Sugerencia: Actualizar el DOM directamente
      setTimeout(() => {
        window.location.reload();  
      }, 500);
    }
  }
};

// Observación: La función createTaskElement podría beneficiarse de un mejor manejo
// de los estilos y clases
export const createTaskElement = (title, description, date, state) => {
  // Observación: La creación de elementos podría simplificarse usando innerHTML
  // o un template literal
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

  // Observación: La estructura del DOM podría simplificarse usando un template
  article.appendChild(h4);
  article.appendChild(p);
  article.appendChild(dateSpan);
  article.appendChild(stateSpan);

  div.appendChild(article);
  div.appendChild(deleteSpam);
  return div;
};

// Observación: La función clearForm podría beneficiarse de una validación
// de que los elementos existen antes de limpiarlos
export const clearForm = () => {
  let { title, state, description } = getFormInputs();
  title.value = "";
  state.value = "";
  description.value = "";
};

// Observación: La función getRandomCharacters podría beneficiarse de un sistema de caché
// y un mejor manejo de errores
export const getRandomCharacters = async (count = 5) => {
  try {
    // Observación: Sería útil implementar un sistema de caché para los personajes
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

    // Observación: La creación de elementos del DOM podría optimizarse
    // usando un DocumentFragment
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
    // Observación: Sería útil mostrar un mensaje de error al usuario
  }
};
