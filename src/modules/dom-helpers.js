const DOMHelpers = (() => {

    Node.prototype.on = window.on = function (type, callback) {
        this.addEventListener(type, callback);
    }

    NodeList.prototype.on = NodeList.prototype.addEventListener = function (type, callback) {
        this.forEach((el, i) => {
            el.on(type, callback);
        })
    }

    const createElement = (tag, attributes) => {
        const element = document.createElement(tag);
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value)
            })
        }
        return element;
    }

    const getElement = (element) => document.querySelector(element);

    const getElements = (elements) => document.querySelectorAll(elements);

    const addClass = (element, ...classNames) => element.classList.add(...classNames);

    const removeClass = (element, ...classNames) => element.classList.remove(...classNames);

    const toggleClass = (element, ...classNames) => element.classList.toggle(...classNames);

    const showForm = (form) => {
        addClass(form, 'form-active');
    }
    const hideForm = (form) => {
        removeClass(form, 'form-active');
    }

    const getSiblings = (elem) => {
        const siblings = [];
        let sibling = elem.parentNode.firstChild;

        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== elem) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling
        }

        return siblings;
    };

    return {
        createElement,
        getElement,
        getElements,
        addClass,
        removeClass,
        toggleClass,
        showForm,
        hideForm,
        getSiblings,
    }
})()


export default DOMHelpers;