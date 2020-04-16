import Projects from './projects.js';

const { getSelectedProject, getProjects } = Projects;

const Todos = (() => {

    const todos = [];

    const getTodos = () => todos;

    const addTodo = (todo) => {
        const allProjects = JSON.parse(getProjects());
        const selected = JSON.parse(getSelectedProject());

        for (let key in allProjects) {
            if (allProjects[key].title === selected) {
                allProjects[key].todos.push(todo)
            }
        }

        localStorage.setItem('projects', JSON.stringify(allProjects));
    }

    return {
        getTodos,
        addTodo,
    }
})()

export default Todos;