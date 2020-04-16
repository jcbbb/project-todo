import init from './modules/init.js';
import DOMHelpers from './modules/dom-helpers.js';
import DisplayController from './modules/display-controller.js';
import Projects from './modules/projects.js';
import flatpickr from 'flatpickr';
import Todos from './modules/todos.js';

// Start default projects
init();

// Init date picker
flatpickr('#due', {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
});


const {
    createElement,
    getElement,
    getElements,
    showForm,
    hideForm,
    addClass,
    removeClass,
    toggleClass,
    clearFields,
} = DOMHelpers;

const { addProject, selectProject, getSelectedProject } = Projects;
const {
    renderMain,
    renderProjects,
    hightlightProject,
    renderTodos,
    renderDefault,
} = DisplayController;

const { addTodo } = Todos;

const addProjectBtn = getElement('.form__cta');
const addProjectForm = getElement('.form');
const addTodoBtn = getElement('.todos__cta');
const addTodoFormContainer = getElement('.addTodoFormContainer');
const AddTodoFormCloseBtn = getElement('.addTodoForm__close');
const formGroup = getElement('.form__group');
const addTodoForm = getElement('.addTodoForm');

addProjectBtn.on('click', (ev) => {
    const childNode = ev.target.childNodes[0];
    toggleClass(childNode, 'cta-icon--rotate')
    toggleClass(formGroup, 'form__group--active');
})

addTodoBtn.on('click', () => showForm(addTodoFormContainer));
AddTodoFormCloseBtn.on('click', () => hideForm(addTodoFormContainer));

// Close todo form on Esc key
window.on('keyup', (ev) => {
    if (ev.keyCode === 27) {
        hideForm(addTodoFormContainer)
    }
});

addProjectForm.on('submit', (ev) => {
    ev.preventDefault();
    let inputValue = getElement('.form input').value;
    addProject(inputValue);
    renderProjects();
    renderMain(inputValue);
    selectProject(inputValue);
    addProjectBtn.click();
})

addTodoForm.on('submit', (ev) => {
    ev.preventDefault();
    const obj = {}

    obj.title = getElement('input[name="title"]').value
    obj.due = getElement('input[name="due"]').value;
    obj.priority = getElement('input[name="priority"]:checked').value;
    obj.description = getElement('textarea[name="description"]').value;
    obj.completed = false;
    obj.isImportant = false;

    addTodo(obj);
    hideForm(addTodoFormContainer);
    renderTodos();
    clearFields(addTodoForm);
});


if (localStorage.getItem('projects') !== null) {
    renderDefault();
    renderProjects();
}

const listItems = getElements('.list__item');
listItems.on('click', ({ target }) => {
    const { title } = target.dataset;
    renderMain(title);
    selectProject(title);
    hightlightProject(target);
    renderTodos();
});