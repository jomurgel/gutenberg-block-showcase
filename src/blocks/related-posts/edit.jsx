import { Output } from './components/output';
import Loader from './components/loader';
import Search from './components/search';
import { useEffect, useRef, useState, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useBlockProps } from '@wordpress/block-editor';

const Edit = ({ className, setAttributes }) => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [queriedPosts, setQueriedPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [totalPosts, setTotalPosts] = useState('');
  const [query, setQuery] = useState('');

  let container = useRef(null);

  /**
   * Current parent block props.
   */
  const blockProps = useBlockProps({ className });

  function handleEvent(clickedPost) {
    console.log(clickedPost);
    const postContainer = clickedPost.e.target;
    const postData = clickedPost.post;


    if (postContainer.classList.contains('is-selected')) {
      const i = selectedPosts.indexOf(postData);

      if (i !== -1) {
        selectedPosts.splice(i, 1);
      }
    } else {
      setSelectedPosts(selectedPosts.concat(postData))
    }
  }

  function returnQuery(response) {
    setQuery(response.string);
    setQueriedPosts(response.data);
  }

  function fetchData(page) {
    setIsLoaded(false);

    apiFetch({ path: `wp/v2/posts?page=${page}&per_page=5`, parse: false })
      .then(response => {
        if (response.status === 200) {
          const total = parseInt(response.headers.get('X-WP-Total'));
          setTotalPosts(total);
          return response.json();
        }
        setAtEnd(true);
        return [];
      })
      .then(response => {
        setPage(page);
        setAllPosts(allPosts.concat(response));
        setIsLoaded(true);
      });
  }

  const selectedPostsUpdated = useMemo(() => selectedPosts, [ selectedPosts])

  useEffect(() => {
    if (page === 1 && allPosts.length === 0 && queriedPosts.length === 0) {
      fetchData(page);
    }

    const containerHelper = () => {
      if (allPosts.length !== totalPosts && (containerscrollTop === (containerscrollHeight - containeroffsetHeight))) {
        fetchData(page + 1);
      } else {
        setAtEnd(true);
      }
    }

    container.current.addEventListener('scroll', containerHelper);

    return () => container.current.removeEventListener('scroll', containerHelper);
  }, [page, allPosts, queriedPosts, container?.current])


  const ReturnLayout = () => {
    return (
      <div className="related-posts-row">
        <Output
          activeClass={selectedPostsUpdated}
          textRef={(element) => container.current = element}
          title={query !== '' ? 'Queried Posts' : 'Posts'}
          className="related-left-column"
          key=""
          posts={query !== '' ? queriedPosts : allPosts}
          handleEvent={handleEvent}
        />
        <Output
          activeClass={selectedPostsUpdated}
          title="Selected Posts"
          className="related-right-column"
          key=""
          posts={selectedPostsUpdated}
          handleEvent={handleEvent}
          onChange={setAttributes({ selectedPosts: selectedPostsUpdated })}
        />
      </div>
    );
  }

  return (
    <>
      <div key="" {...blockProps}>
        <Search
          key=""
          className="related-posts-search-form"
          onQueryChange={returnQuery}
        />
        {!isLoaded ? <Loader key="" /> : null}
        <ReturnLayout />
      </div>
    </>
  )
}

export default Edit;
