# Use Timer
Simple count-up timer that returns minutes and seconds in a duple.

## Usage
``` jsx
const App = () => {
	return <Timer isActive={false} />
}
```

## Props
| prop      | type    | required | default | description                             |
|-----------|---------|----------|---------|-----------------------------------------|
| className | string  | no       | ''      | Class name to append to the timer span. |
| isActive  | boolean | yes      |         | When the timer should kick off or stop. |
| label     | string  | no       | Timer   | Aria label.                             |
| style     | object  | no       | {}      | Style object.                           |