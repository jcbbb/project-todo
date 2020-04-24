import { formatDate } from 'flatpickr';
import Todos from './todos.js';
import {
	selectProject,
	removeProject,
	getSelectedProject,
} from './projects.js';
import {
	createElement,
	getElement,
	addClass,
	removeClass,
	getSiblings,
	toggleClass,
	toggleClasses,
} from './dom-helpers.js';

const {
	getTodos,
	selectTodo,
	toggleCompleted,
	removeTodo,
	markImportant,
} = Todos;

const DisplayConroller = (() => {
	const renderProjects = () => {
		// Side icons for projects
		const icons = [
			'uil uil-apps',
			'uil uil-calendar-alt',
			'uil uil-favorite',
			'uil uil-clipboard-notes',
		];

		const projects = JSON.parse(localStorage.getItem('projects'));
		const projectList = getElement('.list');
		projectList.innerHTML = '';
		projects.forEach((project, index) => {
			const projectLi = createElement('li', {
				class:
					getSelectedProject() === project.title
						? 'list__item list__item--active'
						: 'list__item',
				id: index,
				'data-title': project.title,
			});
			const spanIcon = createElement('span', {
				class:
					index < 3
						? `${icons[index]} side-icon`
						: `${icons[3]} side-icon`,
			});
			const spanText = createElement('span', {
				class: 'list__item-text',
			});

			const spanCount = createElement('span', {
				class: 'list__item-count',
			});

			const deleteIcon = createElement('i', {
				class: 'uil uil-times side-icon-delete',
			});

			spanCount.textContent =
				project.todos.length >= 1 ? project.todos.length : '';
			spanText.textContent = project.title;

			projectLi.addEventListener('click', () => {
				console.log('Hey!');
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

			index < 3
				? projectLi.append(spanIcon, spanText, spanCount)
				: projectLi.append(spanIcon, spanText, spanCount, deleteIcon);

			projectList.append(projectLi);
		});
	};

	const renderMain = (title) => {
		const todosHeading = getElement('.todos__heading');
		todosHeading.textContent = title;
	};

	const hightlightProject = (target) => {
		const siblings = getSiblings(target);

		siblings.forEach((sibling) => {
			removeClass(sibling, 'list__item--active');
			removeClass(sibling.firstElementChild, 'circle-filled--active');
		});

		addClass(target, 'list__item--active');
		addClass(target.firstElementChild, 'circle-filled--active');
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

			// if date is not specified, don't render!
			todo.due === ''
				? detailsDiv.append(todoTitle)
				: detailsDiv.append(todoTitle, dateSpan);
			li.append(prioritySpan, detailsDiv, actionsDiv);

			li.addEventListener('click', ({ target }) => {
				const { title } = target.dataset;
				selectTodo(title);
			});

			li.addEventListener('animationend', renderTodos);

			prioritySpan.addEventListener('click', ({ target }) => {
				const todoItem = target.closest('.todos__list-item');
				toggleCompleted(todoItem.dataset.title);
				toggleLinethrough(todoItem);
				toggleCheckmark(target);
			});

			spanDelete.addEventListener('click', ({ target }) => {
				const todoItem = target.closest('.todos__list-item');
				addClass(todoItem, 'animated', 'bounceOutLeft');
				removeTodo(todoItem.dataset.title);
				renderProjects();
			});

			spanMark.addEventListener('click', ({ target }) => {
				const todoItem = target.closest('.todos__list-item');
				markImportant(todoItem.dataset.title);
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

	return {
		renderProjects,
		renderMain,
		renderTodos,
		hightlightProject,
	};
})();

export default DisplayConroller;
