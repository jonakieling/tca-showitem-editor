/**
 * The editor builds the contents of a given container based on a ShowitemTabs configuration
 *
 * This class wraps functionality to modify the showitem configuration in a WYSIWYG style manner by encapsulating
 * the ShowitemTabs api and taking care of building the required HTML elements and event listeners.
 */
class ShowitemEditor {

    /**
     * The editor is initialized with a ShowitemTabs configuration and a container element to build the markup into.
     *
     * @param tabs The ShowitemTabs configuration to load initially.
     * @param container Node to build the editor contents into.
     */
    constructor(tabs, container) {
        this.tabs = tabs;
        this.container = container;

        this.buildEditor();
    }

    /**
     * Builds the editor contents based on the current ShowitemTabs configuration.
     *
     * - Add navigation and content for each tab.
     * - Add display for the current showitem string to see the results of editing.
     *
     * @see createNavItem
     * @see createContentItem
     */
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

        // add the current config string
        const currentShowitemStringWrapper = document.createElement('div');
        currentShowitemStringWrapper.id = 'current-config';
        const currentShowitemString = document.createElement('span');
        currentShowitemString.textContent = this.tabs.toString();
        currentShowitemStringWrapper.appendChild(currentShowitemString);
        this.container.appendChild(currentShowitemStringWrapper);
    }

    /**
     * Creates navigation elements and registers event listeners for moving tabs and changing the current tab.
     *
     * @param i Index of the tab to build a nav item for.
     * @param tab Configuration of the tab.
     * @returns {HTMLLIElement}
     */
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
        moveTabLeft.classList.add('fas', 'fa-caret-left', 'move-tab', 'left');
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
        moveTabRight.classList.add('fas', 'fa-caret-right', 'move-tab', 'right');
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

    /**
     * Creates tab contents and registers event listeners for moving items around.
     *
     * @param i Index of the tab to build a nav item for.
     * @param tab Configuration of the tab.
     * @returns {HTMLDivElement}
     */
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
            moveItemUp.classList.add('fas', 'fa-caret-up', 'move-item', 'up');
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
            moveItemDown.classList.add('fas', 'fa-caret-down', 'move-item', 'down');
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

    /**
     * Simplifies TYPO3 localization string by only returning the last part of it which is the localization key.
     * This is close enough to a speaking name for labels without parsing and fetching entries from localization files.
     * LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general
     *
     * @param label The label to convert
     * @returns {string|*}
     */
    simplifyLocalizedLabel(label) {
        if (label.startsWith('LLL:')) {
            return label.split(':').pop()
        }

        return label;
    }

    /**
     * Iteratively remove all child nodes of the editors container.
     */
    clearContainer() {
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.lastChild);
        }
    }

    /**
     * Rebuild the tabs configuration of this editor with the given string.
     * Then clears and rebuilds the container.
     *
     * This is somewhat inefficient, but with the limited complexity of the editor simplicity of the api is chosen over
     * efficiency.
     *
     * @param showitemString
     */
    reloadFromString(showitemString) {
        this.tabs.buildConfigFromString(showitemString);
        this.clearContainer();
        this.buildEditor();
    }

    /**
     * First moves a tab in the given direction by using the ShowitemTabs api and then rebuilds the editor.
     *
     * Reasons for rebuilding are the same as for this.reloadFromString()
     *
     * @param index The index of the tab to move
     * @param direction The direction as integer 1 or -1
     */
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

    /**
     * First moves a item of a tab in the given direction by using the ShowitemTabs api and then rebuilds the editor.
     *
     * Reasons for rebuilding are the same as for this.reloadFromString()
     *
     * @param tabIndex The index of the tab in which the item is found
     * @param itemIndex The index of the item to move
     * @param direction The direction as integer 1 or -1
     */
    moveItem(tabIndex, itemIndex, direction) {
        if (this.tabs.moveItem(tabIndex, itemIndex, direction)) {
            this.clearContainer();
            this.buildEditor();
        }
    }
}