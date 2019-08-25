requirejs(["ShowitemTabs", "Editor"], function () {
    let showitemString = document.querySelector("input[name='showitem-string']").getAttribute('value');
    let tabs = new ShowitemTabs(showitemString);
    let container = document.querySelector("#tabs-container");
    let editor = new ShowitemEditor(tabs, container);
});

