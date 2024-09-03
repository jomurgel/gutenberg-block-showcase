# Search Form
A parent component containing a search form (core `SearchControl` component), search results, and
individual cards for selection.

The component also provides a "load more" feature which will load additional posts page by page
upon request.

This component is exported to `PostSearchForm` at the root and used inside the `PostSearchModal`
which expects the same [props](#props).

## Usage
```jsx
  <SearchForm
    className="custom-class"
    onChange={ () => null }
  />
```

## Props
| prop        | type   | required | default                          | description                                                                                                    |
|-------------|--------|----------|----------------------------------|----------------------------------------------------------------------------------------------------------------|
| className   | string | no       | ''                               | Classname to add to the parent form component.                                                                 |
| help        | string | no       | Search for any post type content | Help text displays below the search input.                                                                     |
| label       | string | no       | Search for content               | Label text that appears above the search input.                                                                |
| maxPages    | int    | no       | 5                                | Max number of pages to return. If 100 pages of results, the max number of loadable pages is this value.        |
| onChange    | func   | yes      |                                  | Callback function returns selected post object.                                                                |
| placeholder | string | no       | Search for content               | Placeholder text that appears inside the search input.                                                         |
| postTypes   | array  | no       | []                               | An array of post types to search by. Default all post types supported by REST or where `show_in_rest` is true. |
| threshold   | int    | no       | 3                                | Minimum number of characters required for search before a fetch is made.                                       |
