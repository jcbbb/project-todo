import { addClass, getElement, getElements } from './dom-helpers';
import { getSelectedProject } from './projects';
import DisplayConroller from './display-controller';

const { renderMain, renderTodos, renderTodoDetails, hightlightProject } = DisplayConroller;
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
				renderMain(item.dataset.title);
				renderTodos();
			}
		});

		const observerCallback = (mutations, observer) => {
			mutations.forEach((mutation) => {
				const target = mutation.target.lastElementChild;
				if (target.innerText === getSelectedProject()) {
					hightlightProject(target);
				}
				observer.disconnect();
			});
		};

		// init observer
		const observer = new MutationObserver(observerCallback);
		const target = getElement('.list');
		observer.observe(target, {
			childList: true,
		});
	});
};

export default init;
