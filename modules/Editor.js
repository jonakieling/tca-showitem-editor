class ShowitemEditor {

    constructor(tabs, container) {
        this.tabs = tabs;
        this.container = container;

        this.buildEditor();
    }

    buildEditor() {
        const navFragment = document.createDocumentFragment();
        const contentFragment = document.createDocumentFragment();
        for (let i = 0; i < this.tabs.config.length; i++) {
            let tab = this.tabs.config[i];

            // nav item
            const li = this.createNavItem(i, tab);
            navFragment.appendChild(li);

            // content item
            let div = this.createContentItem(i, tab);
            contentFragment.appendChild(div);
        }

        // add the navigation to the contaienr
        const navUl = document.createElement('ul');
        navUl.setAttribute('class', 'nav');
        navUl.appendChild(navFragment);
        this.container.appendChild(navUl);

        // add the tab contents to the contaienr
        const contentContainer = document.createElement('div');
        contentContainer.setAttribute('class', 'tabs');
        contentContainer.appendChild(contentFragment);
        this.container.appendChild(contentContainer);
    }

    createNavItem(i, tab) {
        const li = document.createElement('li');
        li.setAttribute('id', 'nav-' + i);
        li.classList.add('nav-item');
        if (i === 0) {
            li.classList.add('active');
        }
        li.dataset.content = 'content-' + i;
        const moveTabLeft = document.createElement('i');
        moveTabLeft.classList.add('fas', 'fa-caret-left');
        li.appendChild(moveTabLeft);
        const tabLabel = document.createElement('span');
        tabLabel.textContent = ' ' + this.simplifyLocalizedLabel(tab.label) + ' ';
        li.appendChild(tabLabel);
        const moveTabRight = document.createElement('i');
        moveTabRight.classList.add('fas', 'fa-caret-right');
        li.appendChild(moveTabRight);
        li.setAttribute('title', tab.label);
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
        return li;
    }

    createContentItem(i, tab) {
        const div = document.createElement('div');
        div.setAttribute('id', 'content-' + i);
        div.classList.add('tab-content');
        if (i === 0) {
            div.classList.add('active');
        }
        for (let j = 0; j < tab.items.length; j++) {
            let item = tab.items[j];
            const itemElement = document.createElement('div');

            const moveItemUp = document.createElement('i');
            moveItemUp.classList.add('fas', 'fa-caret-up');
            itemElement.appendChild(moveItemUp);

            const itemText = document.createElement('span');
            if (item.type === 'palette') {
                itemText.textContent = ' pallete ' + item.identifier + ' ' + this.simplifyLocalizedLabel(item.label) + ' ';
            } else if (item.type === 'linebreak') {
                const itemElement = document.createElement('div');
                itemText.textContent = ' linebreak ';
            } else if (item.type === 'field') {
                const itemElement = document.createElement('div');
                itemText.textContent = ' field ' + item.identifier + ' ' + this.simplifyLocalizedLabel(item.label) + ' ';
            }
            itemElement.appendChild(itemText);

            const moveItemDown = document.createElement('i');
            moveItemDown.classList.add('fas', 'fa-caret-down');
            itemElement.appendChild(moveItemDown);

            div.appendChild(itemElement);
        }
        return div;
    }

    simplifyLocalizedLabel(label) {
        if (label.startsWith('LLL:')) {
            return label.split(':').pop()
        }

        return label;
    }

    clearContainer() {
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.lastChild);
        }
    }

    reloadFromString(showitemString) {
        this.tabs.buildConfigFromString(showitemString);
        this.clearContainer();
        this.buildEditor();
    }
}