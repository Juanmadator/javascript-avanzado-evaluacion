import {
  tasksArray,
  getTaskContent,
  getFormInputs,
  verifytaskTitle,
  showMessage,
} from "./index.js";

export const updateTask = (e) => {
  e.preventDefault();
};


export const createTask = (event) => {
	event.preventDefault();
  
	const { title, state, description, dateEnd } = getFormInputs();
  
	let exists = verifytaskTitle(title.value); // esta función debería verificar si el título ya existe en localStorage
	let added = false;
	if (!exists) {
	  const validStates = ["completado", "en-progreso", "pendiente"];
	  const isValidState = validStates.includes(state.value.toLowerCase());
  
	  if (title.value && state.value && description.value && dateEnd.value && isValidState) {
		const task = {
		  id: crypto.randomUUID(),
		  title: title.value,
		  description: description.value,
		  dateEnd: dateEnd.value,
		  state: state.value
		};
  
		// 1. Cargar las tareas actuales desde localStorage (si hay)
		const currentTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
		// 2. Añadir la nueva tarea
		currentTasks.push(task);
  
		// 3. Guardar el array actualizado en localStorage
		localStorage.setItem("tasks", JSON.stringify(currentTasks));
		added = true;
	  }
	  
	  if (!added) {
		showMessage("errorCreate");
	  } else {
		  showMessage("taskCreated");
		  //limpiar formulario
		  clearForm();
	  }
	}
  };

export const createTaskElement = (title, description, date, state) => {
  const article = document.createElement("article");
  article.classList.add("tasks__task");

  const h4 = document.createElement("h4");
  h4.textContent = title;

  const p = document.createElement("p");
  p.classList.add("tasks__task-description");
  p.textContent = `Descripción: ${description}`;

  const dateSpan = document.createElement("span");
  dateSpan.textContent = date;

  const stateSpan = document.createElement("span");
  stateSpan.classList.add(state.toLowerCase(), "state");
  stateSpan.textContent = state.charAt(0).toUpperCase() + state.slice(1);

  article.appendChild(h4);
  article.appendChild(p);
  article.appendChild(dateSpan);
  article.appendChild(stateSpan);

  return article;
};

const clearForm = () => {
	let {title,state,description} = getFormInputs();
	title.value = "";
	state.value = "";
	description.value = "";
}
