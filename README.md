TYPO3 tca showitem editor
=========================

this string defines how to render a form for the TYPO3 backend.
it is used to configure the form for a database table which is used
to create and edit data.

```
--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,--palette--;;general,--palette--;;headers,bodytext;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:bodytext_formlabel,--div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,--palette--;;frames,--palette--;;appearanceLinks,--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,--palette--;;language,--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,--palette--;;hidden,--palette--;;access,--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories,--div--;LLL:EXT:core/Resources/Private/Language/locallang_tca.xlf:sys_category.tabs.category,categories,--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,rowDescription,--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended, --div--;LLL:EXT:gridelements/Resources/Private/Language/locallang_db.xlf:gridElements, tx_gridelements_container, --linebreak--, tx_gridelements_columns
```

you can group fields into tabs, add linebreaks, and even move
configurations into socalled pallets for reuse within the same
database table.

the syntax and the nature of it being a string can lead to complex
configurations which are hard to read at times.

goal
----

provide a wysiwyg editor for TYPO3 TCA showitem form definitions.

As a nice side effect I get to know the inner workings and
particularities of the TCA form rendering.

Depending how things work out, this could be used as a debugging tool
for such strings.

state
-----

* a static showitem string which gets loaded on page load
* basic parsing of the showitem string
* the basic tab look and feel of the TYPO3 backend
* palletes are not being resolved yet and simple shown as fields

next up
-------

1. learn about palletes and render them correctly
2. ui to edit the tabs configuration and get the updated string
