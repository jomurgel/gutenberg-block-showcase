# Use Post Terms
Return term objects for a post/post type and taxonomy slug, if supported.

## Usage
``` jsx
const [ postTerms, hasPostTerms, isLoading ] = usePostTerms( postId, postType, term );
```

## Params
- `postId` post id of the current post.
- `postType` post type of the current post.
- `term` term object to retrieve term objects for.