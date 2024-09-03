# LockableFlatTermSelector
Similar to the `PostTaxonomiesFlatTermSelector` that comes with Gutenberg core, but is locked down to prevent creation of new post tags. Only allowed to select existing terms in this feature.

Used to avoid unnecessary creation of new tags.

## Usage
```jsx
<LockableFlatTermSelector slug={ term } locked />
```

## Props
| name   | type    | required | description                                |
|--------|---------|----------|--------------------------------------------|
| slug   | string  | yes      | The taxonomy slug to represent.            |
| locked | boolean | no       | Whether or not to lock down term creation. |
