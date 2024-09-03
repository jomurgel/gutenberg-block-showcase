# Search Card
This component displays a single post with a minimal set of post object values.

## Usage
```jsx
  <SearchCard
	onChange={ (next) => onChange(next) }
    value={ posts }
  />
```

## Component Props
| prop        | type   | required | default            | description                                               |
|-------------|--------|----------|--------------------|-----------------------------------------------------------|
| value       | array  | yes      |                    | Array of post objects.                                    |
| onChange    | func   | yes      |                    | Callback function returns the post object value selected. |

## Expected Value Shape
The below is the expected object shape. By default the global search endpoint `wp/v2/search` returns
everything below save the media and the post_type (which is the subtype).

The media object contains the thumbnail and featured image alt text. Easily cached rather than
needing to make a REST request in browser.

The post_type is the Singular name of the current post type. The subtype is the post's post type slug.

```js
{
	id: PropTypes.number,
	media: PropTypes.shape( {
		alt: PropTypes.string,
		url: PropTypes.string,
	} ),
	post_type: PropTypes.string,
	status: PropTypes.string,
	subtype: PropTypes.string,
	title: PropTypes.string,
	type: PropTypes.exact( 'post' ),
	url: PropTypes.string,
}
```