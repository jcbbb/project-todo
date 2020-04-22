import { addClass, getElement, getElements } from './dom-helpers.js';
import { selectProject } from './projects.js';
import DisplayConroller from './display-controller.js';

const { renderMain, renderTodos, hightlightProject } = DisplayConroller;
const init = () => {
	const projects = [
		{
			title: 'Overview',
			todos: [],
		},
		{
			title: 'Today',
			todos: [],
		},
		{
			title: 'Important',
			todos: [],
		},
	];
	if (localStorage.getItem('projects') === null) {
		localStorage.setItem('projects', JSON.stringify(projects));
	}
	if (localStorage.getItem('selected') === null) {
		localStorage.setItem('selected', 'Overview');
	}

	window.addEventListener('DOMContentLoaded', () => {
		const selected = localStorage.getItem('selected');
		const listItems = getElements('.list__item');
		listItems.forEach((item) => {
			if (item.dataset.title === selected) {
				addClass(item, 'list__item--active');
				addClass(item.firstElementChild, 'circle-filled--active');
				renderMain(item.dataset.title);
				renderTodos();
			}
		});

		const observerCallback = (mutations) => {
			mutations.forEach((mutation) => {
				const target = mutation.target.lastElementChild;

				selectProject(target.innerText);
				hightlightProject(target);
			});
		};

		const observer = new MutationObserver(observerCallback);
		const target = getElement('.list');
		observer.observe(target, {
			childList: true,
		});
	});
};

export default init;
