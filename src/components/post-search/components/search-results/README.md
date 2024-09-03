# Component Search Results
Utilizes the `SearchCard` component to output a list of search-for results. A load-more option is
available if there are enough pages of search results to support it via props.

## Usage
```jsx
<SearchResults
	canLoadMore
	isLoading={ loading }
	isVisible
	onChange={ ( next ) => console.log(next) }
	onLoadMore={ () => null }
	options={ [] }
	page={ 1 }
	query="search query"
/>
```

## Props
| prop        | type   | required | description                                                            |
|-------------|--------|----------|------------------------------------------------------------------------|
| canLoadMore | bool   | yes      | Whether or not the "load more content" button is to be shown.          |
| isLoading   | bool   | yes      | Whether or not we should display the loading spinner or busy button.   |
| isVisible   | bool   | yes      | Whether or not the search results should be shown.                     |
| onChange    | func   | yes      | Callback returning a selected post object.                             |
| onLoadMore  | func   | yes      | Callback when the "load more content" is clicked. Increments page + 1. |
| options     | array  | yes      | Array of post objects defined in the `SearchCard` component.           |
| query       | string | yes      | Search string.                                                         |
| page        | int    | yes      | Current page number of fetched results. Used by `onLoadMore`.          |