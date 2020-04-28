import { getSelectedProject, getProjects } from './projects';

const Todos = (() => {
	const getTodos = () => {
		let todos;

		const selected = getSelectedProject();
		const allProjects = JSON.parse(getProjects());
		Object.entries(allProjects).forEach(([, project]) => {
			if (project.title === selected) {
				todos = project.todos;
			}
		});

		return todos;
	};

	const addTodo = (todo) => {
		if (existingTodo(todo.title)) throw new Error('Todo already exists');

		const allProjects = JSON.parse(getProjects());
		const selected = getSelectedProject();

		Object.entries(allProjects).forEach(([, project]) => {
			if (project.title === selected) {
				project.todos.push(todo);
			}
		});

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};

	const existingTodo = (todoTitle) => {
		const allProjects = JSON.parse(getProjects());
		let exists = false;
		Object.entries(allProjects).forEach(([, project]) => {
			const { todos } = project;

			todos.forEach((todo) => {
				if (todo.title === todoTitle) exists = true;
			});
		});
		return exists;
	};

	const selectTodo = (todoTitle) => {
		const selectedTodo = { title: '', todo: {} };
		const selected = getSelectedProject();
		const allProjects = JSON.parse(getProjects());

		selectedTodo.title = selected;

		Object.entries(allProjects).forEach(([, project]) => {
			if (project.title === selected) {
				const { todos } = project;

				todos.forEach((todo) => {
					if (todo.title === todoTitle) {
						selectedTodo.todo = todo;
					}
				});
			}
		});

		localStorage.setItem('selectedTodo', JSON.stringify(selectedTodo));
	};

	const getSelectedTodo = () => localStorage.getItem('selectedTodo');

	const toggleCompletedTodo = (todoTitle) => {
		const allProjects = JSON.parse(getProjects());

		Object.entries(allProjects).forEach(([, project]) => {
			const { todos } = project;

			todos.forEach((todo) => {
				if (todo.title === todoTitle) {
					todo.completed = !todo.completed;
				}
			});
		});

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};

	const removeTodo = (todoTitle) => {
		const allProjects = JSON.parse(getProjects());

		Object.entries(allProjects).forEach(([, project]) => {
			project.todos = project.todos.filter((todo) => todo.title !== todoTitle);
		});

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};

	const markImportant = (todoTitle) => {
		const selected = JSON.parse(getSelectedTodo());
		selected.todo.isImportant = !selected.todo.isImportant;

		const allProjects = JSON.parse(getProjects());
		Object.entries(allProjects).forEach(([, project]) => {
			const { todos } = project;

			todos.forEach((todo) => {
				if (todo.title === todoTitle) {
					todo.isImportant = !todo.isImportant;
				}
			});
		});

		localStorage.setItem('projects', JSON.stringify(allProjects));
		localStorage.setItem('selectedTodo', JSON.stringify(selected));
	};

	const getTodoDetails = (todoTitle) => {
		const allProjects = JSON.parse(getProjects());
		Object.entries(allProjects).forEach(([, project]) => {
			const { todos } = project;

			todos.forEach((todo) => {
				if (todo.title === todoTitle) {
					return todo;
				}
			});
		});
	};

	const handleDueUpdate = (newDue) => {
		const selected = JSON.parse(getSelectedTodo());
		const allProjects = JSON.parse(getProjects());

		Object.entries(allProjects).forEach(([, project]) => {
			const { todos } = project;

			todos.forEach((todo) => {
				if (todo.title === selected.todo.title) {
					todo.due = newDue;
				}
			});
		});

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};

	const handlePriorityUpdate = (newPriority) => {
		const selected = JSON.parse(getSelectedTodo());
		const allProjects = JSON.parse(getProjects());
		Object.entries(allProjects).forEach(([, project]) => {
			const { todos } = project;

			todos.forEach((todo) => {
				if (todo.title === selected.todo.title) {
					todo.priority = newPriority;
				}
			});
		});

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};

	const handleDescriptionUpdate = (newDescription) => {
		const selected = JSON.parse(getSelectedTodo());
		const allProjects = JSON.parse(getProjects());

		Object.entries(allProjects).forEach(([, project]) => {
			const { todos } = project;

			todos.forEach((todo) => {
				if (todo.title === selected.todo.title) {
					todo.description = newDescription;
				}
			});
		});

		localStorage.setItem('projects', JSON.stringify(allProjects));
	};

	return {
		getTodos,
		addTodo,
		selectTodo,
		getSelectedTodo,
		toggleCompletedTodo,
		removeTodo,
		markImportant,
		getTodoDetails,
		handleDueUpdate,
		handlePriorityUpdate,
		handleDescriptionUpdate,
	};
})();

export default Todos;
