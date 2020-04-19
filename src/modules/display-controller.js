import { formatDate } from 'flatpickr';
import DOMHelpers from './dom-helpers.js';
import Projects from './projects.js';
import Todos from './todos.js';

const { selectProject, getSelectedProject, getProjects } = Projects;
const {
	createElement,
	getElement,
	addClass,
	removeClass,
	getSiblings,
	toggleClass,
	toggleClasses,
} = DOMHelpers;

const {
	getTodos,
	selectTodo,
	toggleCompleted,
	removeTodo,
	markImportant,
} = Todos;

const DisplayConroller = (() => {
	const renderProjects = () => {
		const projects = JSON.parse(localStorage.getItem('projects'));
		const projectList = getElement('.projects-list');
		projectList.innerHTML = '';
		projects.forEach((project, index) => {
			if (index > 2) {
				const projectLi = createElement('li', {
					class: 'projects-list__item',
					id: index,
					'data-title': project.title,
				});
				const spanCircle = createElement('span', {
					class: 'circle-filled',
				});
				const spanText = createElement('span', {
					class: 'projects-list__item-text',
				});
				const spanCount = createElement('span', {
					class: 'projects-list__item-count',
				});
				const deleteIcon = createElement('i', {
					class: 'uil uil-times side-icon-delete',
				});
				spanCount.textContent =
					project.todos.length >= 1 ? project.todos.length : '';

				spanText.textContent = project.title;
				projectLi.addEventListener('click', () => {
					renderMain(project.title);
					selectProject(project.title);
					renderTodos();
				});

				projectLi.append(spanCircle, spanText, spanCount, deleteIcon);
				projectList.append(projectLi);
			}
		});
	};

	const renderMain = (title) => {
		const todosHeading = getElement('.todos__heading');
		todosHeading.textContent = title;
	};

	const hightlightProject = (target) => {
		const siblings = getSiblings(target);

		siblings.forEach((sibling) =>
			removeClass(sibling, 'list__item--active'),
		);

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
				class: todo.completed
					? `${todo.priority} completed`
					: todo.priority,
			});

			const detailsDiv = createElement('div', {
				class: todo.completed
					? 'todos__list-details line-through'
					: 'todos__list-details',
			});
			const todoTitle = createElement('p', {
				class: 'todos__list-title',
			});
			const dateSpan = createElement('span', {
				class: 'todos__list-date',
			});
			const actionsDiv = createElement('div', {
				class: todo.completed
					? 'todos__list-actions line-through'
					: 'todos__list-actions',
			});
			const spanMark = createElement('span', {
				class: 'todos__action-mark',
			});
			const spanDelete = createElement('span', {
				class: 'todos__action-delete',
			});

			// icons
			const favIcon = createElement('i', {
				class: todo.isImportant
					? 'uim uim-favorite'
					: 'uil uil-favorite',
			});
			const trashIcon = createElement('i', { class: 'uil uil-trash' });

			// TextContents
			todoTitle.textContent = todo.title;
			dateSpan.textContent = formatDate(new Date(todo.due), 'F j, Y');

			// Appending
			spanMark.append(favIcon);
			spanDelete.append(trashIcon);
			actionsDiv.append(spanMark, spanDelete);
			detailsDiv.append(todoTitle, dateSpan);
			li.append(prioritySpan, detailsDiv, actionsDiv);

			li.on('click', ({ target }) => {
				const { title } = target.dataset;
				selectTodo(title);
			});

			prioritySpan.on('click', ({ target }) => {
				const todoItem = target.closest('.todos__list-item');
				toggleCompleted(todoItem.dataset.title);
				toggleLinethrough(todoItem);
				toggleCheckmark(target);
			});

			spanDelete.on('click', ({ target }) => {
				const todoItem = target.closest('.todos__list-item');
				addClass(todoItem, 'animated', 'bounceOutLeft');
				removeTodo(todoItem.dataset.title);
			});

			spanMark.on('click', ({ target }) => {
				const todoItem = target.closest('.todos__list-item');
				markImportant(todoItem.dataset.title);
			});

			li.on('transitionend', () => {
				renderTodos();
			});

			ul.append(li);
		});
	};

	const toggleLinethrough = (target) => {
		target.childNodes.forEach((child, index) => {
			if (index === 0) return;
			toggleClass(child, 'line-through');
		});
	};

	const toggleCheckmark = (target) => {
		toggleClasses(target, 'completed', 'animated', 'bounceIn');
	};

	const renderDefault = () => {
		const defaultProjects = JSON.parse(localStorage.getItem('projects'));
		const icons = [
			'uil uil-apps',
			'uil uil-calendar-alt',
			'uil uil-favorite',
		];
		const ul = getElement('.list');

		defaultProjects.forEach((project, index) => {
			if (index < 3) {
				const li = createElement('li', {
					class: 'list__item',
					'data-title': project.title,
				});
				const icon = createElement('i', {
					class: `${icons[index]} side-icon`,
				});
				const span = createElement('span', {
					class: 'list__item-text',
				});
				const spanCount = createElement('span', {
					class: 'list__item-count',
				});

				spanCount.textContent =
					project.todos.length >= 1 ? project.todos.length : '';
				span.textContent = project.title;

				li.append(icon, span, spanCount);
				ul.append(li);
			}
		});
	};
	return {
		renderProjects,
		renderMain,
		renderTodos,
		hightlightProject,
		renderDefault,
	};
})();

export default DisplayConroller;
