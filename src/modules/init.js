import DOMHelpers from './dom-helpers.js';
import DisplayConroller from './display-controller';

const { addClass, getElements } = DOMHelpers;
const { renderMain, renderTodos } = DisplayConroller;
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

	window.addEventListener('DOMContentLoaded', () => {
		const selected = JSON.parse(localStorage.getItem('selected'));
		const listItems = getElements('.list__item');
		listItems.forEach((item) => {
			if (item.dataset.title === selected) {
				addClass(item, 'list__item--active');
				renderMain(item.dataset.title);
				renderTodos();
			}
		});
	});
};

export default init;

