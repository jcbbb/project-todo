import { getSelectedProject, getProjects } from './projects.js';

const Todos = (() => {
	const getTodos = () => {
		let todos;

		const selected = getSelectedProject();
		const projects = JSON.parse(getProjects());
		for (let key in projects) {
			if (projects[key].title === selected) {
				todos = projects[key].todos;
			}
		}
		return todos;
	};

	const addTodo = (todo) => {
		const allProjects = JSON.parse(getProjects());
		const selected = getSelectedProject();

		for (let key in allProjects) {
			if (allProjects[key].title === selected) {
				allProjects[key].todos.push(todo);
			}
		}

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};

	const selectTodo = (todoTitle) => {
		const selectedTodo = {};
		const selected = getSelectedProject();
		const allProjects = JSON.parse(getProjects());

		selectedTodo.title = selected;
		for (let key in allProjects) {
			if (allProjects[key].title === selected) {
				const todos = allProjects[key].todos;

				todos.forEach((todo) => {
					if (todo.title === todoTitle) {
						selectedTodo.todo = todo;
					}
				});
			}
		}

		localStorage.setItem('selectedTodo', JSON.stringify(selectedTodo));
	};

	const toggleCompleted = (todoTitle) => {
		const allProjects = JSON.parse(getProjects());

		for (let key in allProjects) {
			const todos = allProjects[key].todos;

			todos.forEach((todo) => {
				if (todo.title === todoTitle) {
					todo.completed = !todo.completed;
				}
			});
		}

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};

	const removeTodo = (todoTitle) => {
		const allProjects = JSON.parse(getProjects());
		for (let key in allProjects) {
			allProjects[key].todos = allProjects[key].todos.filter(
				(todo) => todo.title !== todoTitle,
			);
		}

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};

	const markImportant = (todoTitle) => {
		const allProjects = JSON.parse(getProjects());
		for (let key in allProjects) {
			const todos = allProjects[key].todos;

			todos.forEach((todo) => {
				if (todo.title === todoTitle) {
					todo.isImportant = !todo.isImportant;
				}
			});
		}

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};
	return {
		getTodos,
		addTodo,
		selectTodo,
		toggleCompleted,
		removeTodo,
		markImportant,
	};
})();

export default Todos;
