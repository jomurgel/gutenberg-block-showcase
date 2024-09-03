# useDelay
A simple hook to return a boolean based on whether or not a delay has happened. Default 2500 seconds.

## Usage

```jsx
const MyComponent = () => {
  const isDelayed = useDelay(500);

  // This value will be true after 500 milliseconds
  console.log(isDelayed);
};
```
