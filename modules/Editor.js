class ShowitemEditor {

    constructor(tabs, container) {
        this.tabs = tabs;
        this.container = container;

        this.buildEditor();
    }

    buildEditor() {
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
            const moveTabLeft = document.createElement('i');
            moveTabLeft.classList.add('fas', 'fa-caret-left');
            li.appendChild(moveTabLeft);
            const tabName = document.createElement('span');
            tabName.textContent = ' ' + this.simplifyLocalizedLabel(tab.name) + ' ';
            li.appendChild(tabName);
            const moveTabRight = document.createElement('i');
            moveTabRight.classList.add('fas', 'fa-caret-right');
            li.appendChild(moveTabRight);
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
            contentFragment.appendChild(div);
        }

        navUl.appendChild(navFragment);
        this.container.appendChild(navUl);

        contentContainer.appendChild(contentFragment);
        this.container.appendChild(contentContainer);
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