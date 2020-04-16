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
        }
    ]
    if (localStorage.getItem('projects') === null) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

}

export default init;