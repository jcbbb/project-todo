import DOMHelpers from './dom-helpers.js';
import Projects from './projects.js';

const { selectProject, getSelectedProject, getProjects } = Projects;
const { createElement, getElement, addClass, removeClass, getSiblings } = DOMHelpers;

const DisplayConroller = (() => {

    const renderProjects = () => {
        const projects = JSON.parse(localStorage.getItem('projects'));
        const projectList = getElement('.projects-list');
        projectList.innerHTML = '';
        projects.forEach((project, index) => {
            const projectLi = createElement('li', { class: 'projects-list__item', id: index, 'data-title': project.title });
            const spanCircle = createElement('span', { class: 'circle-filled' });
            const spanText = createElement('span', { class: 'projects-list__item-text' });
            const deleteIcon = createElement('i', { class: 'uil uil-times side-icon-delete' });
            spanText.textContent = project.title;
            projectLi.addEventListener('click', () => {
                renderMain(project.title);
                selectProject(project.title);
            })

            projectLi.append(spanCircle, spanText, deleteIcon);
            projectList.append(projectLi);
        })
    }

    const renderMain = (title) => {
        const todosHeading = getElement('.todos__heading');
        todosHeading.textContent = title;
    }

    const hightlightProject = (target) => {
        const siblings = getSiblings(target)

        siblings.forEach((sibling) => removeClass(sibling, 'list__item--active'));

        addClass(target, 'list__item--active');
    }

    const renderTodos = () => {
        const ul = getElement('.todos__list');
        ul.innerHTML = '';

        let todos;

        const selected = JSON.parse(getSelectedProject());
        const projects = JSON.parse(getProjects());
        for (let key in projects) {
            if (projects[key].title === selected) {
                todos = projects[key].todos;
            }
        }

        todos.forEach((todo) => {
            const li = createElement('li', { class: 'todos__list-item' });
            const prioritySpan = createElement('span', { class: todo.priority });
            const detailsDiv = createElement('div', { class: 'todos__list-details' });
            const todoTitle = createElement('p', { class: 'todos__list-title' });
            const dateSpan = createElement('span', { class: 'todos__list-date' });
            const actionsDiv = createElement('div', { class: 'todos__list-actions' });
            const spanMark = createElement('span', { class: 'todos__action-mark' });
            const spanDelete = createElement('span', { class: 'todos__action-delete' });

            // icons
            const favIcon = createElement('i', { class: 'uil uil-favorite' });
            const trashIcon = createElement('i', { class: 'uil uil-trash' });

            //TextContents
            todoTitle.textContent = todo.title;
            dateSpan.textContent = todo.date;

            // Appending
            spanMark.append(favIcon);
            spanDelete.append(trashIcon);
            actionsDiv.append(spanMark, spanDelete);
            detailsDiv.append(todoTitle, dateSpan);
            li.append(prioritySpan, detailsDiv, actionsDiv);

            ul.append(li);
        })
    }
    return { renderProjects, renderMain, renderTodos, hightlightProject }
})()


export default DisplayConroller;