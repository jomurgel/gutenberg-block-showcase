# MostUsedTerms Component
Displaying a variety of most used terms by taxonomy.

## Usage
```jsx
<MostUsedTerms onSelect={() => null} taxonomy={ taxonomyObject } />
```

## Props
| name     | type     | required | description                                                                           |
|----------|----------|----------|---------------------------------------------------------------------------------------|
| onSelect | function | yes      | Setter for a selected term. Returns a term object containing the id, name, and count. |
| taxonomy | object   | yes      | Taxonomy object.                                                                      |