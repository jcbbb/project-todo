import flatpickr from 'flatpickr';
import init from './modules/init';
import DisplayController from './modules/display-controller';
import Todos from './modules/todos';
import { addProject, selectProject } from './modules/projects';
import {
	getElement,
	showForm,
	hideForm,
	toggleClass,
	clearFields,
} from './modules/dom-helpers';

const { renderMain, renderProjects, renderTodos } = DisplayController;

const { addTodo } = Todos;

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

addProjectBtn.addEventListener('click', (ev) => {
	const childNode = ev.target.firstElementChild;
	toggleClass(childNode, 'cta-icon--rotate');
	toggleClass(formGroup, 'form__group--active');
});

addTodoBtn.addEventListener('click', () => showForm(addTodoFormContainer));
AddTodoFormCloseBtn.addEventListener('click', () =>
	hideForm(addTodoFormContainer),
);

// Close todo form on Esc key
window.addEventListener('keyup', (ev) => {
	if (ev.keyCode === 27) {
		hideForm(addTodoFormContainer);
	}
});

addProjectForm.addEventListener('submit', (ev) => {
	ev.preventDefault();
	let inputValue = getElement('.form input').value;

	addProject(inputValue);
	selectProject(inputValue);
	renderProjects();
	renderMain(inputValue);
	renderTodos();
	addProjectBtn.click();
});

addTodoForm.addEventListener('submit', (ev) => {
	ev.preventDefault();
	const obj = {};

	obj.title = getElement('input[name="title"]').value;
	obj.due = getElement('input[name="due"]').value;
	obj.priority = getElement('input[name="priority"]:checked').value;
	obj.description = getElement('textarea[name="description"]').value;
	obj.completed = false;
	obj.isImportant = false;

	addTodo(obj);
	clearFields(addTodoForm);
	hideForm(addTodoFormContainer);
	renderTodos();
	renderProjects();
});

if (localStorage.getItem('projects') !== null) {
	renderProjects();
}
