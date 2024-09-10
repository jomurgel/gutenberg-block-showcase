import apiFetch from "@wordpress/api-fetch";

/**
 * @todo: refactor into a functional component.
 */
const Search = ({ className, onQueryChange }) => {
  const classList = className || 'search-form';

  function setQuery(e) {
    fetchQueryData(e.target.value);
  }

  function fetchQueryData(queryString) {
    if (queryString !== '') {
      apiFetch({ path: `/wp/v2/posts?search=${queryString}&filter[posts_per_page]=-1`, parse: false })
        .then(response => {
          return response.json();
        })
        .then(response => {
          return onQueryChange({
            string: queryString,
            data: response,
          });
        });
    } else {
      return onQueryChange({
        string: '',
        data: [],
      });
    }
  }

  function handleKeyPress(event) {
    // Disable enter search.
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  return (
    <form className={classList}>
      <input
        type="text"
        onChange={setQuery}
        onKeyPress={handleKeyPress}
        placeholder="Search..."
      />
    </form>
  );
}

export default Search;
