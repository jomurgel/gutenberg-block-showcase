# Render Appender
A custom render appender for use with InnerBlocks allowing you to insert a block of your choice with props of your choice.

This allows you also to pass default attributes to the selected block type(s) and limit the max number of insertable items.

## Usage
```jsx
<RenderAppender
	attributes={{ text: 'This is a test' }}
	block="core/paragraph"
	callback={(nextName, nextAttributes) => callback(nextName, nextAttributes)}
	clientId={clientId}
	icon="plus"
	label={__('Add Block', 'gutenberg-block-showcase')}
	max={4}
/>
```

## Props
| prop       | type           | required | default     | description                                                                    |
|------------|----------------|----------|-------------|--------------------------------------------------------------------------------|
| attributes | object         | no       | {}          | An object container block attributes for the block defined.                    |
| callback   | function       | no       | () => null  | Callback returns set block name and attributes.                                |
| block      | string         | yes      |             | Block name, including namespace. eg. `core/paragraph`.                         |
| clientId   | string         | yes      |             | The parent block with InnerBlocks support.                                     |
| icon       | string|element | no       | null        | An icon to appear next to the label.                                           |
| label      | string         | no       | 'Add Block' | The text for the button.                                                       |
| max        | int            | no       | 2           | Max number of blocks you are allowed to insert. Allows you to limit insertion. |
