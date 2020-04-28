const getSelectedProject = () => localStorage.getItem('selected');

const selectProject = (projectTitle) => localStorage.setItem('selected', projectTitle);

const getProjects = () => localStorage.getItem('projects');

const addProject = (projectTitle) => {
	const projects = JSON.parse(getProjects());
	const obj = {};
	const todos = [];

	obj.title = projectTitle;
	obj.todos = todos;

	projects.push(obj);

	localStorage.setItem('projects', JSON.stringify(projects));
};
const removeProject = (projectTitle) => {
	let projects = JSON.parse(getProjects());

	projects = projects.filter((project) => project.title !== projectTitle);

	localStorage.setItem('projects', JSON.stringify(projects));
};
export { addProject, removeProject, selectProject, getSelectedProject, getProjects };
