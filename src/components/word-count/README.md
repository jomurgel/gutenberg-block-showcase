# Word Count
Displays the number of words and characters given a string.

## Usage
```jsx
<WordCount
    text="This is a string"
    excludeCharSpaces={ true }
    showRemainingAlert={ 70 }
/>
```

#### Note
The `showRemainingAlert` prop will be used in order to show the visual indication for the remaining character count.

## Props
| props                   | type   | required | default | description                                                          |
|-------------------------|--------|----------|---------|----------------------------------------------------------------------|
| text                    | string | yes      |         | String for which to determine word and character count.              |
| excludeCharSpaces       | bool   | no       | false   | Decide weather to exclude spaces from character count?               |
| showRemainingAlert      | number | no       |         | Weather to show the visual indication of remaining character count ? |