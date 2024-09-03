# SEO Preview Edit
Provides an editable preview component with editable title and description.

- Title override: `mt_seo_title`
- Description override: `mt_seo_description`

## Usage
```jsx
 <SeoPreviewEdit
	description="SEO Description"
	isSelected={true}
	link="https://test.com"
	onChange={onChangeCallback}
	published="2022-04-13T15:38:50"
	title="SEO Title"
 />
```

## Props
| prop        | type     | required | default | description                                                        |
|-------------|----------|----------|---------|--------------------------------------------------------------------|
| description | string   | yes      |         | SEO description to display.                                        |
| isSelected  | bool     | yes      | false   | Shows editable fields when isSelected is true.                     |
| link        | string   | yes      |         | Canonical url.                                                     |
| onUpdate    | function | yes      |         | Callback function, returns object of edited title and description. |
| published   | string   | yes      |         | Post published date.                                               |
| title       | string   | yes      |         | SEO title to display.                                              |
