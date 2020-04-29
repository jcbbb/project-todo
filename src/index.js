import flatpickr from 'flatpickr';
import init from './modules/init';
import DisplayController from './modules/display-controller';
import Todos from './modules/todos';
import { addProject, selectProject, getSelectedProject } from './modules/projects';
import {
	getElement,
	getElements,
	showForm,
	hideForm,
	showModal,
	hideModal,
	toggleClass,
	removeClass,
	addClass,
	clearFields,
	toggleClasses,
} from './modules/dom-helpers';

const { renderMain, renderProjects, renderTodos, renderFilteredTodos } = DisplayController;

const { addTodo, removeTodo, handleDueUpdate, handlePriorityUpdate, handleDescriptionUpdate, markImportant } = Todos;

// Start default projects
init();

// Init date picker
flatpickr('#due', {
	altInput: true,
	altFormat: 'F j, Y',
	dateFormat: 'Y-m-d',
});

flatpickr('#due-2', {
	allInput: true,
	altFormat: 'F j, Y',
	dateFormat: 'Y-m-d',
});

const addProjectBtn = getElement('.form__cta');
const addProjectForm = getElement('.form');
const addTodoBtn = getElement('.todos__cta');
const addTodoFormContainer = getElement('.addTodoFormContainer');
const AddTodoFormCloseBtn = getElement('.addTodoForm__close');
const formGroup = getElement('.form__group');
const addTodoForm = getElement('.addTodoForm');
const modalContainer = getElement('.modal-container');
const modalQuestion = getElement('.question__cta');
const modalOk = getElement('.ok__cta');
const aside = getElement('.aside');
const overlay = getElement('.overlay');
const todoDetails = getElement('.todo-details');
const chevron = getElement('.chevron-icon');

addProjectBtn.addEventListener('click', (ev) => {
	const childNode = ev.target.firstElementChild;
	toggleClass(childNode, 'cta-icon--rotate');
	toggleClass(formGroup, 'form__group--active');

	if (window.innerWidth < 768) {
		toggleClass(aside, 'aside--active');
		toggleClass(overlay, 'overlay--active');
	}
});

addTodoBtn.addEventListener('click', () => showForm(addTodoFormContainer));
AddTodoFormCloseBtn.addEventListener('click', () => {
	hideForm(addTodoFormContainer);
});

addProjectForm.addEventListener('submit', (ev) => {
	ev.preventDefault();
	const inputValue = getElement('.form input').value;

	addProject(inputValue);
	selectProject(inputValue);
	renderProjects();
	renderMain(inputValue);
	renderTodos();
	clearFields(addProjectForm);

	toggleClass(addProjectBtn.firstElementChild, 'cta-icon--rotate');
	toggleClass(formGroup, 'form__group--active');
});

// Modal actions
modalQuestion.addEventListener('click', () => {
	showModal(modalContainer, 'Yeah, of course! Why would I lie to you?', '&#x1f643');
});
modalOk.addEventListener('click', () => {
	hideModal(modalContainer);
});

addTodoForm.addEventListener('submit', (ev) => {
	const selected = getSelectedProject();
	ev.preventDefault();
	const obj = {};

	obj.title = getElement('input[name="title"]').value;
	obj.due = getElement('input[name="due"]').value;
	obj.priority = getElement('input[name="priority"]:checked').value;
	obj.description = getElement('textarea[name="description"]').value;
	obj.completed = false;
	obj.isImportant = selected === 'Important';

	try {
		addTodo(obj);
		clearFields(addTodoForm);
		hideForm(addTodoFormContainer);
		renderTodos();
		renderProjects();
	} catch (err) {
		if (err) {
			showModal(modalContainer, 'Oh-oh... Looks like you already have that todo.', '&#x1f97a;');
		}
	}
});

// Update due date
const dueInput = getElement('#due-2');
dueInput.addEventListener('change', ({ target }) => {
	handleDueUpdate(target.value);
	renderTodos();
});

// Update priority
const priorityGroup = getElements('input[name="priority-2"]');
priorityGroup.forEach((priority) => {
	priority.addEventListener('click', ({ target }) => {
		handlePriorityUpdate(target.value);
		renderTodos();
	});
});

// Update markImportant
const mark = getElement('.mark');
mark.addEventListener('click', ({ target }) => {
	const child = target.childNodes[1];
	markImportant(target.parentNode.previousElementSibling.innerText);

	if (child.classList.contains('marked')) {
		removeClass(child, 'marked', 'animated', 'bounceIn');
		addClass(child, 'unmarked', 'animated', 'bounceIn');
	} else {
		removeClass(child, 'unmarked', 'animated', 'bounceIn');
		addClass(child, 'marked', 'animated', 'bounceIn');
	}
	renderTodos();
});

// Update description
const description = getElement('#description-2');
description.addEventListener('change', ({ target }) => {
	handleDescriptionUpdate(target.value);
});

// Delete todo
const todoDeleteBtn = getElement('.todos__action-delete');
todoDeleteBtn.addEventListener('click', ({ target }) => {
	removeTodo(target.parentNode.previousElementSibling.innerText);
	renderTodos();
	toggleClass(overlay, 'overlay--active');
	toggleClass(todoDetails, 'todo-details--mobile-active');
});
// Search input
const updateSearchText = (value) => {
	const heading = getElement('.todos__heading');
	heading.textContent = `Searching for ${value.toLowerCase()}`;
};

const searchInput = getElement('.search-bar__input');
searchInput.addEventListener('keyup', ({ target }) => {
	updateSearchText(target.value);
	renderFilteredTodos(target.value);
});

searchInput.addEventListener('blur', () => {
	if (searchInput.value === '') {
		renderMain(getSelectedProject());
	}
});

// Close on Esc key
document.addEventListener('keyup', (ev) => {
	if (ev.keyCode === 27) {
		hideForm(addTodoFormContainer);

		if (aside.classList.contains('aside--active')) {
			removeClass(aside, 'aside--active');
			removeClass(addProjectBtn.firstElementChild, 'cta-icon--rotate');
			removeClass(formGroup, 'form__group--active');
			toggleClass(overlay, 'overlay--active');
		} else if (todoDetails.classList.contains('todo-details--mobile-active')) {
			removeClass(todoDetails, 'todo-details--mobile-active', 'todo-details--active');
			toggleClass(overlay, 'overlay--active');
		}
	}
});

// Close on clicking outside of modal
document.addEventListener('click', (ev) => {
	if (ev.target === overlay) {
		if (aside.classList.contains('aside--active')) {
			removeClass(aside, 'aside--active');
			removeClass(addProjectBtn.firstElementChild, 'cta-icon--rotate');
			removeClass(formGroup, 'form__group--active');
			toggleClass(overlay, 'overlay--active');
		} else if (todoDetails.classList.contains('todo-details--mobile-active')) {
			removeClass(todoDetails, 'todo-details--mobile-active', 'todo-details--active');
			toggleClass(overlay, 'overlay--active');
		}
	}
});

// Chevron
chevron.addEventListener('click', ({ target }) => {
	const child = target.firstElementChild;
	toggleClass(target, 'chevron-icon--active');
	toggleClass(aside, 'aside--active-small');
	toggleClass(child, 'chevron-icon--left');
});

if (localStorage.getItem('projects') !== null) {
	renderProjects();
}
