class ShowitemTabs {
    constructor(showitemString) {
        this.buildConfigFromString(showitemString);
    }

    buildConfigFromString(showitemString) {
        // remove whitespaces to prevent ambiguities when splitting into tokens
        showitemString = showitemString.replace(/\s/g, '');
        // hold all tab identifiers in array to keep orderings
        let tabs = [
            ''
        ];
        // initiate tabs config  with default tab
        let config = [
            {
                label: tabs[0],
                items: []
            }
        ];
        // form definitions are defined in a comma separated sequence, we put them in an array to process further
        let parts = showitemString.split(',');
        let currentTab = 0; // keep track of the current tab to hop around and put items in the correct tab
        let generalTab = -1; // items without a tab (before the first --div--) are move to the general tab
        for (let i = 0; i < parts.length; i++) {

            if (parts[i].startsWith('--div--')) { // a new tab is defined and added
                const tabLabel = parts[i].split(';')[1];
                if (
                    tabLabel.startsWith('LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general')
                    && generalTab === -1
                ) {
                    generalTab = i;
                }
                let potentiallyExistingTabIndex = tabs.indexOf(tabLabel);
                if (potentiallyExistingTabIndex === -1) {
                    tabs.push(tabLabel);
                    config.push({
                        label: tabLabel,
                        items: []
                    });
                    currentTab = config.length - 1; // current tab is the new one added
                } else {
                    currentTab = potentiallyExistingTabIndex; // if a tab is already defined it is set as the current
                }

            } else if (parts[i].startsWith('--palette--')) { // a pallete is defined and added to the current tab
                let palette = parts[i].split(';');
                config[currentTab].items.push({
                    type: 'palette',
                    label: palette[1],
                    identifier: palette[2]
                });

            } else if (parts[i].startsWith('--linebreak--')) { // a linebreak is defined and added to the current tab
                config[currentTab].items.push({
                    type: 'linebreak'
                });

            } else { // everything else are fields with optional labels that are added to the current tab
                let field = parts[i].split(';');
                switch (field.length) {
                    case 1:
                        config[currentTab].items.push({
                            type: 'field',
                            label: '',
                            identifier: field[0]
                        });
                        break;
                    case 2:
                        config[currentTab].items.push({
                            type: 'field',
                            label: field[1],
                            identifier: field[0]
                        });
                        break;
                }
            }
        }

        // move items before the first --div-- into the tab general
        const defaultItems = config[0].items;
        const generalItems = config[generalTab].items;
        config[generalTab].items = generalItems.concat(defaultItems);
        config = config.slice(1, config.length);

        this.config = config;
    }

    toString() {
        let showitemString = '';
        for (let i = 0; i < this.config.length; i++) {
            let tab = this.config[i];
            // add tab indicator of not the first tab and add the tab label
            if (tab.label !== '') {
                showitemString += ',--div--;' + tab.label;
            }
            // add items
            for (let j = 0; j < tab.items.length; j++) {
                let item = tab.items[j];
                if (item.type === 'palette') {
                    showitemString += ',--palette--;' + item.label + ';' + item.identifier;
                } else if (item.type === 'linebreak') {
                    showitemString += ',--linebreak--';
                } else if (item.type === 'field') {
                    if (item.label !== '') {
                        showitemString += ',' + item.identifier + ';' + item.label;
                    } else {
                        showitemString += ',' + item.identifier;
                    }
                }
            }
        }
        return showitemString.substr(1);
    }

    moveTab(tabIndex, direction) {
        const {array, moved} = this.moveArrayEntry(this.config, tabIndex, direction);
        this.config = array;
        return moved;
    }

    moveItem(tabIndex, itemIndex, direction) {
        const {array, moved} = this.moveArrayEntry(this.config[tabIndex].items, itemIndex, direction);
        this.config[tabIndex].items = array;
        return moved;
    }

    moveArrayEntry(array, index, direction) {
        if (index + direction >= 0 && index + direction < array.length) {
            const target = array[index + direction];
            array = array.copyWithin(index + direction, index, index + 1);
            array[index] = target;
            return {array, moved: true};
        }

        return {array, moved: false};
    }

}