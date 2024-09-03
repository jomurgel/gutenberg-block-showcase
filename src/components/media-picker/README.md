# MediaPicker
Allows for a reusable media uploader, replacer, and remover for adding media to blocks.

See also https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/media-placeholder/README.md for additional descriptions of shared props.

## Usage
``` jsx
<MediaPicker
	className="custom-class-name"
	allowedType={ [ 'image' ] }
	icon="format-image"
	label={ __( 'Product Image', 'gutenberg-block-showcase' ) }
	instructions={__(
		'Upload an image file, pick one from your media library, or add one with a URL.',
		'gutenberg-block-showcase'
	)}
	onReset={ () => setAttributes( { image: 0 } ) }
	onSelect={ ( next ) => setAttributes( { image: next } ) }
	size="thumbnail"
	value={ image }
/>
```

## Props
| prop           | type            | required | default               | description                                                           |
|----------------|-----------------|----------|-----------------------|-----------------------------------------------------------------------|
| allowedTypes   | array           | no       | [ 'image' ]           | Array of allowed types.                                               |
| className      | string          | no       | ''                    | Classname string.                                                     |
| icon           | string|element  | no       | 'format-image'        | Dashicon name or SVG element.                                         |
| imageClassName | string          | no       | 'component__image'    | Image classname around preview image.                                 |
| label          | string          | no       | 'Image'               | Label that displays in the placeholder and in the media picker modal. |
| onReset        | function        | yes      |                       | Callback function that fires on reset.                                |
| onSelect       | function        | yes      |                       | Callback function that returns a media id on media change/upload.     |
| size           | string          | no       | 'medium'              | Size of image thumbnail to return from REST.                          |
| value          | int             | yes      |                       | Media id.                                                             |
