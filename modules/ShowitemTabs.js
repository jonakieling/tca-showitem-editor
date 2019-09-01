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
                name: tabs[0],
                items: []
            }
        ];
        // form definitions are defined in a comma separated sequence, we put them in an array to process further
        let parts = showitemString.split(',');
        let currentTab = 0; // keep track of the current tab to hop around and put items in the correct tab
        for (let i = 0; i < parts.length; i++) {

            if (parts[i].startsWith('--div--')) { // a new tab is defined and added
                const tabName = parts[i].split(';')[1];
                let potentiallyExistingTabIndex = tabs.indexOf(tabName);
                if (potentiallyExistingTabIndex === -1) {
                    config.push({
                        name: tabName,
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

        this.config = config;
        return config;
    }

    toString() {
        let showitemString = '';
        for (let i = 0; i < this.config.length; i++) {
            let tab = this.config[i];
            // add tab indicator of not the first tab and add the tab name
            if (tab.name !== '') {
                showitemString += ',--div--;' + tab.name;
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

}