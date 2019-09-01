requirejs(["ShowitemTabs", "Editor"], function () {
    let input = document.querySelector("input[name='showitem-string']");
    let showitemString = input.getAttribute('value');
    let tabs = new ShowitemTabs(showitemString);
    let container = document.getElementById("tabs-container");
    let editor = new ShowitemEditor(tabs, container, input);

    document.getElementById('load-string').addEventListener('click', function (event) {
        editor.loadString();
    });
});

