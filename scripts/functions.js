import {tasksArray, getTaskContent, getFormInputs, verifytaskTitle,showMessage } from "./index.js";

export const updateTask = (e) => {
	e.preventDefault();
};

export const createTask = (event) => {
	let tasksContainer = document.querySelector(".tasks");
	event.preventDefault();

	//!PARA CREAR NO PUEDE EXISTIR VARIAS TAREAS CON EL MISMO NOMBRE
	let { title, state, description, dateEnd } = getFormInputs();

	let exists = verifytaskTitle(title.value);
		let addedArticle;
	if (!exists) {
		if (title.value && state.value && description.value && dateEnd.value && (state.value.toLowerCase()=='completado' || state.value.toLowerCase()=='en-progreso' || state.value.toLowerCase()=='pendiente')) {
				console.log("validado");
				const newTask = createTaskElement(
						title.value,
						description.value,
						dateEnd.value,
						state.value
			);  

			//arreglar
			//una vez creado el article de la tarea...
			//agregarlo a un array de tareas
			//añadir la tarea a un localStorage...
			//cargar todas las tareas de localStorage en la vista...
			

					// Agregar la tarea al contenedor
					addedArticle = tasksContainer.appendChild(newTask);
			}
			
			if (!addedArticle) {
				showMessage('errorCreate');
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
