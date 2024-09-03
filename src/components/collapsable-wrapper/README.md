# Collapsable Wrapper
A simple wrapper component that provides the ability to toggle its contents open
or closed.

Provides also the ability to remove the block from the closed state with a callback
which returns an open/closed boolean, optional.

## Usage
``` jsx
<CollapsableWrapper
	canRemove
	className={className}
	clientId={clientId}
	icon={icon}
	isEditing={true}
	isOpen={true}
	isPreviewing={true}
	onEdit={onEdit}
	onPreview={onPreview}
	onToggle={onToggle}
	title={title}
>
	{children}
</CollapsableWrapper>
```

## Props
| prop         | type            | required | default | description                                                     |
|--------------|-----------------|----------|---------|-----------------------------------------------------------------|
| canRemove    | bool            | no       | false   | Whether or not to allow removing the block by client id.        |
| children     | node            | yes      |         | Children to render inside the component wrapper.                |
| className    | string          | no       | ''      | Classname string.                                               |
| clientId     | string          | yes      |         | Root client id.                                                 |
| icon         | string\|element | no       | ''      | Dashicon name or SVG element.                                   |
| isEditing    | bool            | no       | false   | Whether or not the "edit" state should be visible.              |
| isOpen       | bool            | no       | false   | Whether or not to set the default state to open.                |
| isPreviewing | bool            | no       | false   | Whether or not the "preview" state should be visible            |
| onEdit       | function        | no       | null    | Callback triggered when "edit" BlockControl is clicked.         |
| onPreview    | function        | no       | null    | Callback triggered when "preview" BlockControl is clicked.      |
| onToggle     | function        | no       | null    | Callback that returns the state of the container, true or false |
| title        | string          | no       | ''      | Title string to display when the wrapper is collapsed.          |
