import { formatDate } from 'flatpickr';
import Todos from './todos';
import { selectProject, removeProject, getSelectedProject } from './projects';

import {
	createElement,
	getElement,
	getElements,
	addClass,
	removeClass,
	removeClassFromSiblings,
	toggleClass,
	toggleClasses,
} from './dom-helpers';

const { getTodos, getSelectedTodo, selectTodo, toggleCompletedTodo, removeTodo, markImportant } = Todos;

const DisplayConroller = (() => {
	const renderProjects = () => {
		// Side icons for projects
		const icons = ['view-grid-outline', 'calendar-month-outline', 'star-outline', 'clipboard-check-outline'];

		const projects = JSON.parse(localStorage.getItem('projects'));
		const projectList = getElement('.list');
		projectList.innerHTML = '';
		projects.forEach((project, index) => {
			const projectLi = createElement('li', {
				class: getSelectedProject() === project.title ? 'list__item list__item--active' : 'list__item',
				id: index,
				'data-title': project.title,
			});
			const spanIcon = createElement('i', {
				class: index < 3 ? `mdi mdi-${icons[index]} side-icon` : `mdi mdi-${icons[3]} side-icon`,
			});
			const spanText = createElement('span', {
				class: 'list__item-text',
			});

			const spanCount = createElement('span', {
				class: 'list__item-count',
			});

			const deleteIcon = createElement('ion-icon', {
				class: 'mdi mdi-close side-icon-delete',
			});

			spanCount.textContent = project.todos.length >= 1 ? project.todos.length : '';
			spanText.textContent = project.title;

			projectLi.addEventListener('click', () => {
				renderMain(project.title);
				selectProject(project.title);
				hightlightProject(projectLi);
				renderTodos();
			});
			projectLi.addEventListener('animationend', renderProjects);

			deleteIcon.addEventListener('click', (ev) => {
				ev.stopPropagation();

				addClass(projectLi, 'animated', 'bounceOutLeft');
				selectProject(projectLi.previousSibling.dataset.title);
				hightlightProject(projectLi.previousSibling);
				renderMain(getSelectedProject());
				renderTodos();
				removeProject(project.title);
			});

			// Don't render delete icon for default projects
			if (index < 3) {
				projectLi.append(spanIcon, spanText, spanCount);
			} else {
				projectLi.append(spanIcon, spanText, spanCount, deleteIcon);
			}

			projectList.append(projectLi);
		});
	};

	const renderMain = (title) => {
		const todosHeading = getElement('.todos__heading');
		todosHeading.textContent = title;
	};

	const hightlightProject = (target) => {
		removeClassFromSiblings(target, 'list__item--active');

		addClass(target, 'list__item--active');
	};

	const renderTodos = () => {
		const ul = getElement('.todos__list');
		ul.innerHTML = '';

		const todos = getTodos();

		todos.forEach((todo) => {
			const li = createElement('li', {
				class: 'todos__list-item',
				'data-title': todo.title,
			});
			const prioritySpan = createElement('span', {
				class: todo.completed ? `${todo.priority} completed` : todo.priority,
			});

			const detailsDiv = createElement('div', {
				class: todo.completed ? 'todos__list-details line-through' : 'todos__list-details',
			});
			const todoTitle = createElement('p', {
				class: 'todos__list-title',
			});
			const dateSpan = createElement('span', {
				class: 'todos__list-date',
			});
			const actionsDiv = createElement('div', {
				class: todo.completed ? 'todos__list-actions line-through' : 'todos__list-actions',
			});
			const spanMark = createElement('span', {
				class: 'todos__action-mark',
			});
			const spanDelete = createElement('span', {
				class: 'todos__action-delete',
			});

			// icons
			const favIcon = createElement('i', {
				class: todo.isImportant ? 'marked' : 'unmarked',
			});
			const trashIcon = createElement('i', { class: 'mdi mdi-trash-can-outline' });

			// TextContents
			todoTitle.textContent = todo.title;
			dateSpan.textContent = formatDate(new Date(todo.due), 'F j, Y');

			// Appending
			spanMark.append(favIcon);
			spanDelete.append(trashIcon);
			actionsDiv.append(spanMark, spanDelete);

			// if date is not specified, don't render!
			if (todo.due === '') {
				detailsDiv.append(todoTitle);
			} else {
				detailsDiv.append(todoTitle, dateSpan);
			}

			li.append(prioritySpan, detailsDiv, actionsDiv);

			li.addEventListener('click', ({ target }) => {
				const { title } = target.dataset;

				addClass(getElement('.overlay'), 'overlay--active');
				addClass(getElement('.todo-details'), 'todo-details--mobile-active');
				selectTodo(title);
				removeClassFromSiblings(target, 'selected');
				addClass(target, 'selected');
				renderTodoDetails();
			});

			li.addEventListener('animationend', (ev) => {
				if (ev.animationName === 'lineAnimation' || ev.animationName === 'bounceIn') {
					return;
				}
				renderTodos();
			});

			prioritySpan.addEventListener('click', (ev) => {
				ev.stopPropagation();

				const todoItem = ev.target.closest('.todos__list-item');
				toggleCompletedTodo(todoItem.dataset.title);
				toggleLinethrough(todoItem);
				toggleClasses(ev.target, 'completed', 'animated', 'bounceIn');
			});

			spanDelete.addEventListener('click', (ev) => {
				ev.stopPropagation();

				const selected = JSON.parse(getSelectedTodo());
				const todoItem = ev.target.closest('.todos__list-item');
				addClass(todoItem, 'animated', 'bounceOutLeft');
				removeTodo(todoItem.dataset.title);
				renderProjects();
				if (selected.todo.title === todoItem.dataset.title) {
					removeClass(getElement('.todo-details'), 'todo-details--active');
				}
			});

			spanMark.addEventListener('click', (ev) => {
				ev.stopPropagation();

				const child = ev.target.childNodes[0];
				const todoItem = ev.target.closest('.todos__list-item');
				markImportant(todoItem.dataset.title);
				if (child.classList.contains('marked')) {
					removeClass(child, 'marked', 'animated', 'bounceIn');
					addClass(child, 'unmarked', 'animated', 'bounceIn');
				} else {
					removeClass(child, 'unmarked', 'animated', 'bounceIn');
					addClass(child, 'marked', 'animated', 'bounceIn');
				}
				renderTodoDetails();
			});

			ul.append(li);
		});
	};

	const renderTodoDetails = () => {
		const selected = JSON.parse(getSelectedTodo());
		const todoHeading = getElement('.todo-details__heading');
		const spanMark = getElement('.mark i');
		const todoDue = getElement('input[name="due-2"]');
		const todoPriority = getElement(`input[value=${selected.todo.priority}]`);
		const todoDescription = getElement('textarea[name="description-2"]');

		todoHeading.textContent = selected.todo.title;
		spanMark.className = selected.todo.isImportant ? 'marked' : 'unmarked';
		todoDue.value = selected.todo.due ? formatDate(new Date(selected.todo.due), 'F j, Y') : 'Pick a date';
		todoPriority.checked = true;
		todoDescription.textContent = selected.todo.description;
	};

	const renderFilteredTodos = (searchTerm) => {
		const todos = getElements('.todos__list-item');

		todos.forEach((todo) => {
			const { title } = todo.dataset;

			if (title.toLowerCase().indexOf(searchTerm) > -1) {
				todo.style.display = 'flex';
			} else {
				todo.style.display = 'none';
			}
		});
	};

	const toggleLinethrough = (target) => {
		target.childNodes.forEach((child, index) => {
			if (index === 0) return;
			toggleClass(child, 'line-through');
		});
	};

	return {
		renderProjects,
		renderMain,
		renderTodos,
		renderFilteredTodos,
		renderTodoDetails,
		hightlightProject,
	};
})();

export default DisplayConroller;
