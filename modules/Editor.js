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

        if (localStorage.getItem('currentTab') >= tabs.config.length) {
            localStorage.setItem('currentTab', 0);
        }

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
        let thatEditor = this; // for event handlers
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

        const newTabNavItem = document.createElement('li');
        newTabNavItem.classList.add('nav-item');
        const addTab = document.createElement('i');
        addTab.classList.add('fas', 'fa-plus', 'item-control');
        addTab.addEventListener('click', function (event) {
            event.stopPropagation();
            thatEditor.addTab();
        });
        newTabNavItem.appendChild(addTab);
        navFragment.appendChild(newTabNavItem);

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

        const tabLabel = document.createElement('span');
        tabLabel.textContent = ' ' + this.simplifyLocalizedLabel(tab.label) + ' ';
        li.appendChild(tabLabel);
        li.appendChild(document.createElement('br'));

        const moveTabLeft = document.createElement('i');
        moveTabLeft.classList.add('fas', 'fa-arrow-left', 'move-tab', 'left', 'item-control');
        moveTabLeft.dataset.tab = i;
        moveTabLeft.dataset.direction = '-1';
        moveTabLeft.addEventListener('click', function (event) {
            event.stopPropagation();
            thatEditor.moveTab(parseInt(this.dataset.tab), parseInt(this.dataset.direction));
        });
        li.appendChild(moveTabLeft);

        const moveTabRight = document.createElement('i');
        moveTabRight.classList.add('fas', 'fa-arrow-right', 'move-tab', 'right', 'item-control');
        moveTabRight.dataset.tab = i;
        moveTabRight.dataset.direction = '1';
        moveTabRight.addEventListener('click', function (event) {
            event.stopPropagation();
            thatEditor.moveTab(parseInt(this.dataset.tab), parseInt(this.dataset.direction));
        });
        li.appendChild(moveTabRight);

        const removeTab = document.createElement('i');
        removeTab.classList.add('fas', 'fa-trash', 'item-control');
        removeTab.dataset.tab = i;
        removeTab.dataset.direction = '-1';
        removeTab.addEventListener('click', function (event) {
            event.stopPropagation();
            thatEditor.removeTab(parseInt(this.dataset.tab));
        });
        li.appendChild(removeTab);

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
            moveItemUp.classList.add('fas', 'fa-arrow-up', 'item-control', 'up');
            moveItemUp.dataset.tab = i;
            moveItemUp.dataset.item = j;
            moveItemUp.dataset.direction = '-1';
            moveItemUp.addEventListener('click', function (event) {
                event.stopPropagation();
                thatEditor.moveItem(parseInt(this.dataset.tab), parseInt(this.dataset.item), parseInt(this.dataset.direction));
            });
            itemElement.appendChild(moveItemUp);

            const moveItemDown = document.createElement('i');
            moveItemDown.classList.add('fas', 'fa-arrow-down', 'item-control', 'down');
            moveItemDown.dataset.tab = i;
            moveItemDown.dataset.item = j;
            moveItemDown.dataset.direction = '1';
            moveItemDown.addEventListener('click', function (event) {
                event.stopPropagation();
                thatEditor.moveItem(parseInt(this.dataset.tab), parseInt(this.dataset.item), parseInt(this.dataset.direction));
            });
            itemElement.appendChild(moveItemDown);

            const removeItem = document.createElement('i');
            removeItem.classList.add('fas', 'fa-trash', 'item-control');
            removeItem.dataset.tab = i;
            removeItem.dataset.item = j;
            removeItem.addEventListener('click', function (event) {
                event.stopPropagation();
                thatEditor.removeItem(parseInt(this.dataset.tab), parseInt(this.dataset.item));
            });
            itemElement.appendChild(removeItem);

            if (item.type === 'palette') {
                itemElement.className = 'palette';
                const paletteHeadline = document.createElement('h4');
                paletteHeadline.textContent = this.simplifyLocalizedLabel(item.title) + this.simplifyLocalizedLabel(item.label) + ' [' + item.identifier + ']';
                itemElement.appendChild(paletteHeadline);
                for (let k = 0; k < item.config.length; k++) {
                    let paletteItem = item.config[k];
                    const paletteItemElement = document.createElement('div');

                    if (paletteItem.type === 'linebreak') {
                        paletteItemElement.className = "linebreak";
                    } else if (paletteItem.type === 'field') {
                        paletteItemElement.className = 'field';
                        const itemText = document.createElement('span');
                        itemText.textContent = ' field ' + paletteItem.identifier + ' ' + this.simplifyLocalizedLabel(paletteItem.label) + ' ';
                        paletteItemElement.appendChild(itemText);
                    }

                    itemElement.appendChild(paletteItemElement);
                }
            } else if (item.type === 'linebreak') {
                itemElement.className = "linebreak"
            } else if (item.type === 'field') {
                itemElement.className = 'field';
                const itemText = document.createElement('span');
                itemText.textContent = ' field ' + item.identifier + ' ' + this.simplifyLocalizedLabel(item.label) + ' ';
                itemElement.appendChild(itemText);
            }

            div.appendChild(itemElement);
        }

        const itemsControl = document.createElement('div');
        itemsControl.className = 'items-control'
        const newItem = document.createElement('i');
        newItem.classList.add('fas', 'fa-plus');
        itemsControl.appendChild(newItem);
        const newField = document.createElement('i');
        newField.classList.add('fas', 'fa-cog', 'item-control');
        newField.title = 'New Field';
        newField.addEventListener('click', function (event) {
            event.stopPropagation();
            thatEditor.addFieldItem(i);
        });
        itemsControl.appendChild(newField);
        const newPalette = document.createElement('i');
        newPalette.classList.add('fas', 'fa-palette', 'item-control');
        newPalette.title = 'New Palette';
        newPalette.addEventListener('click', function (event) {
            event.stopPropagation();
            thatEditor.addPaletteItem(i);
        });
        itemsControl.appendChild(newPalette);
        const newLinebreak = document.createElement('i');
        newLinebreak.classList.add('fas', 'fa-grip-lines', 'item-control');
        newLinebreak.title = 'New Linebreak';
        newLinebreak.addEventListener('click', function (event) {
            event.stopPropagation();
            thatEditor.addLinebreakItem(i);
        });
        itemsControl.appendChild(newLinebreak);
        div.appendChild(itemsControl);

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
        if (label && label.startsWith('LLL:')) {
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
     *
     */
    addTab() {
        this.tabs.addTab({
            label: 'NEW',
            items: []
        })
        localStorage.setItem('currentTab', this.tabs.config.length - 1);
        this.clearContainer();
        this.buildEditor();
    }

    /**
     *
     * @param index
     */
    removeTab(index) {
        this.tabs.removeTab(index);
        if (index <= localStorage.getItem('currentTab') && index >= 0) {
            localStorage.setItem('currentTab', localStorage.getItem('currentTab') - 1);
        }
        this.clearContainer();
        this.buildEditor();
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

    /**
     *
     * @param tabIndex
     */
    addFieldItem(tabIndex) {
        this.tabs.addItem(tabIndex, {
            type: 'field',
            label: 'NEW FIELD',
            identifier: 'NEW_FIELD'
        });
        this.clearContainer();
        this.buildEditor();
    }

    /**
     *
     * @param tabIndex
     */
    addPaletteItem(tabIndex) {
        this.tabs.addItem(tabIndex, {
            type: 'palette',
            title: 'NEW PALETTE',
            identifier: 'NEW_PALETTE',
            config: '',
            label: ''
        });
        this.clearContainer();
        this.buildEditor();
    }

    /**
     *
     * @param tabIndex
     */
    addLinebreakItem(tabIndex) {
        this.tabs.addItem(tabIndex, {
            type: 'linebreak'
        });
        this.clearContainer();
        this.buildEditor();
    }

    /**
     *
     * @param tabIndex
     * @param itemIndex
     */
    removeItem(tabIndex, itemIndex) {
        this.tabs.removeItem(tabIndex, itemIndex);
        this.clearContainer();
        this.buildEditor();
    }
}