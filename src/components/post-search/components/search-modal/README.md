# Search Modal
A parent component containing the `SearchForm` component.

This component is exported to `PostSearchModal` at the root and uses the `PostSearchForm`
component as a child which expects the same [props](#props).

## Usage
```jsx
  <SearchModal
    className="custom-class"
	onChange={ () => null }
	onDismiss={ () => null }
	isVisible
  />
```

## Props
| prop        | type   | required | default                          | description                                                                                                    |
|-------------|--------|----------|----------------------------------|----------------------------------------------------------------------------------------------------------------|
| className   | string | no       | ''                               | Classname to add to the parent form component.                                                                 |
| help        | string | no       | Search for any post type content | Help text displays below the search input.                                                                     |
| isVisible   | bool   | yes      |                                  | Whether or not to display the modal.                                                                           |
| label       | string | no       | Search for content               | Label text that appears above the search input.                                                                |
| maxPages    | int    | no       | 5                                | Max number of pages to return. If 100 pages of results, the max number of loadable pages is this value.        |
| onChange    | func   | yes      |                                  | Callback function returns selected post object.                                                                |
| onDismiss   | func   | yes      |                                  | Callback when the dismiss "X" is pressed in the modal.                                                         |
| placeholder | string | no       | Search for content               | Placeholder text that appears inside the search input.                                                         |
| postTypes   | array  | no       | []                               | An array of post types to search by. Default all post types supported by REST or where `show_in_rest` is true. |
| threshold   | int    | no       | 3                                | Minimum number of characters required for search before a fetch is made.                                       |