# TermSelector Component
Displaying a `FormTokenField` for selecting and searching for taxonomy terms.

## Usage
```jsx
<TermSelector
	canCreate={ ! isLocked && hasCreateAction }
	max={ MAX_TERMS_SUGGESTIONS }
	onChange={ onChange }
	onInputChange={ debounce( searchTerms, 500 ) }
	singularName={ singularName }
	slug={ slug }
	suggestions={ availableTerms.map(
		( term ) => term.name
	) }
	taxonomy={ taxonomy }
	value={ selectedTerms }
/>
```

## Props
| prop          | type     | required | description                                                                      |
|---------------|----------|----------|----------------------------------------------------------------------------------|
| canCreate     | boolean  | yes      | Whether or not term creation is allowed. Displays different text and validation. |
| max           | int      | yes      | Max number of suggestions to display during search.                              |
| onChange      | function | yes      | onChange handler for selection.                                                  |
| onInputChange | function | yes      | onChange handler for search.                                                     |
| slug          | string   | yes      | Taxonomy slug. only required to handle label for tags differntly.                |
| suggestions   | array    | yes      | Array of term objects.                                                           |
| taxonomy      | object   | yes      | Taxonomy object.                                                                 |
| value         | array    | yes      | Array of selected term ids.                                                      |