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
        let thatEditor = this; // for event handlers

        const li = document.createElement('li');
        li.setAttribute('id', 'nav-' + i);
        li.classList.add('nav-item');
        if (i === parseInt(localStorage.getItem('currentTab'))) {
            li.classList.add('active');
        }
        li.dataset.content = 'content-' + i;
        const moveTabLeft = document.createElement('i');
        moveTabLeft.classList.add('fas', 'fa-caret-left', 'move-tab');
        moveTabLeft.dataset.tab = i;
        moveTabLeft.dataset.direction = '-1';
        moveTabLeft.addEventListener('click', function (event) {
            event.stopPropagation();
            thatEditor.moveTab(parseInt(this.dataset.tab), parseInt(this.dataset.direction));
        });
        li.appendChild(moveTabLeft);
        const tabLabel = document.createElement('span');
        tabLabel.textContent = ' ' + this.simplifyLocalizedLabel(tab.label) + ' ';
        li.appendChild(tabLabel);
        const moveTabRight = document.createElement('i');
        moveTabRight.classList.add('fas', 'fa-caret-right', 'move-tab');
        moveTabRight.dataset.tab = i;
        moveTabRight.dataset.direction = '1';
        moveTabRight.addEventListener('click', function (event) {
            event.stopPropagation();
            thatEditor.moveTab(parseInt(this.dataset.tab), parseInt(this.dataset.direction));
        });
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
            localStorage.setItem('currentTab', i);
        });
        return li;
    }

    createContentItem(i, tab) {
        let thatEditor = this; // for event handlers

        const div = document.createElement('div');
        div.setAttribute('id', 'content-' + i);
        div.classList.add('tab-content');
        if (i === parseInt(localStorage.getItem('currentTab'))) {
            div.classList.add('active');
        }
        for (let j = 0; j < tab.items.length; j++) {
            let item = tab.items[j];
            const itemElement = document.createElement('div');

            const moveItemUp = document.createElement('i');
            moveItemUp.classList.add('fas', 'fa-caret-up', 'move-item');
            moveItemUp.dataset.tab = i;
            moveItemUp.dataset.item = j;
            moveItemUp.dataset.direction = '-1';
            moveItemUp.addEventListener('click', function (event) {
                event.stopPropagation();
                thatEditor.moveItem(parseInt(this.dataset.tab), parseInt(this.dataset.item), parseInt(this.dataset.direction));
            });
            itemElement.appendChild(moveItemUp);

            const itemText = document.createElement('span');
            if (item.type === 'palette') {
                itemText.textContent = ' pallete ' + item.identifier + ' ' + this.simplifyLocalizedLabel(item.label) + ' ';
            } else if (item.type === 'linebreak') {
                itemText.textContent = ' linebreak ';
            } else if (item.type === 'field') {
                itemText.textContent = ' field ' + item.identifier + ' ' + this.simplifyLocalizedLabel(item.label) + ' ';
            }
            itemElement.appendChild(itemText);

            const moveItemDown = document.createElement('i');
            moveItemDown.classList.add('fas', 'fa-caret-down', 'move-item');
            moveItemDown.dataset.tab = i;
            moveItemDown.dataset.item = j;
            moveItemDown.dataset.direction = '1';
            moveItemDown.addEventListener('click', function (event) {
                event.stopPropagation();
                thatEditor.moveItem(parseInt(this.dataset.tab), parseInt(this.dataset.item), parseInt(this.dataset.direction));
            });
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

    moveTab(index, direction) {
        if (this.tabs.moveTab(index, direction)) {
            const currentTab = parseInt(localStorage.getItem('currentTab'));
            if (index === currentTab) {
                localStorage.setItem('currentTab', currentTab + direction)
            }
            this.clearContainer();
            this.buildEditor();
        }
    }

    moveItem(tabIndex, itemIndex, direction) {
        if (this.tabs.moveItem(tabIndex, itemIndex, direction)) {
            this.clearContainer();
            this.buildEditor();
        }
    }
}