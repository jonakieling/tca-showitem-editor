requirejs(["ShowitemTabs", "Editor"], function () {
    let input = document.querySelector("input[name='showitem-string']");
    let showitemString = input.value;
    let tabs = new ShowitemTabs(showitemString);
    let container = document.getElementById("tabs-container");
    let editor = new ShowitemEditor(tabs, container);

    document.getElementById('load-string').addEventListener('click', function () {
        editor.reloadFromString(input.value);
    });
});

