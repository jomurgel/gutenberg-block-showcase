# BulkTermCreator Component
Provides a `TextControl` field that supports auto-creation of terms by comma-separated string.

## Usage
```jsx
<BulkTermCreator onChange={ onChange } />
/>
```

## Props
| prop          | type     | required | description                     |
|---------------|----------|----------|---------------------------------|
| onChange      | function | yes      | onChange handler for terms.     |
| selectedTerms | array    | yes      | array of selected term strings. |
