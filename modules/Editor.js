class ShowitemEditor {

    constructor(tabs, container, input) {
        this.tabs = tabs;
        this.container = container;
        this.input = input;

        this.initContainer();
    }

    initContainer() {
        const navFragment = document.createDocumentFragment();
        const navUl = document.createElement('ul');
        navUl.setAttribute('class', 'nav');

        const contentFragment = document.createDocumentFragment();
        const contentContainer = document.createElement('div');
        contentContainer.setAttribute('class', 'tabs');

        for (let i = 0; i < this.tabs.config.length; i++) {
            let tab = this.tabs.config[i];

            // nav item
            const li = document.createElement('li');
            li.setAttribute('id', 'nav-' + i);
            li.classList.add('nav-item');
            if (i === 0) {
                li.classList.add('active');
            }
            li.dataset.content = 'content-' + i;
            li.textContent = i;
            li.setAttribute('title', tab.name);
            li.addEventListener('click', function (event) {
                const activeNav = document.querySelectorAll('.nav-item.active');
                const activeTab = document.querySelectorAll('.tab-content.active');
                activeNav.forEach(function (item) {
                    item.classList.remove('active')
                });
                activeTab.forEach(function (item) {
                    item.classList.remove('active')
                });
                this.classList.add('active');
                document.getElementById(this.dataset.content).classList.add('active');
            });
            navFragment.appendChild(li);

            // content item
            const div = document.createElement('div');
            div.setAttribute('id', 'content-' + i);
            div.classList.add('tab-content');
            if (i === 0) {
                div.classList.add('active');
            }
            for (let j = 0; j < tab.items.length; j++) {
                let item = tab.items[j];
                if (item.type === 'palette') {
                    const itemElement = document.createElement('div');
                    itemElement.textContent = 'pallete ' + item.identifier + ' ' + item.label;
                    div.appendChild(itemElement);
                } else if (item.type === 'linebreak') {
                    const itemElement = document.createElement('div');
                    itemElement.textContent = 'linebreak';
                    div.appendChild(itemElement);
                } else if (item.type === 'field') {
                    const itemElement = document.createElement('div');
                    itemElement.textContent = item.identifier + ' ' + item.label;
                    div.appendChild(itemElement);
                }
            }
            contentFragment.appendChild(div);
        }

        navUl.appendChild(navFragment);
        this.container.appendChild(navUl);

        contentContainer.appendChild(contentFragment);
        this.container.appendChild(contentContainer);
    }

    clearContainer() {
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.lastChild);
        }
    }

    loadString() {
        let string = this.input.value;
        this.tabs.buildConfigFromString(string);
        this.clearContainer();
        this.initContainer();
    }
}