# useOnScreen
Uses an `IntersectionObserver` to determine if the element is visible in the viewPort or not.

## Usage
```jsx
const ref = useRef(null);
const isVisible = useOnScreen( ref?.current );
```

## Props
`ref` reference from the element.
