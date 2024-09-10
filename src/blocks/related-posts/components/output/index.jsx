export const Output = ({
  activeClass,
  className,
  handleEvent,
  posts,
  title,
  textRef,
}) => {

  return (
    <div className={className}>
      <h3 key="">{title}</h3>
      <ul ref={textRef}>
        {posts.map((result, index) => (
          <Item
            isActive={activeClass}
            key={`${result.id}-${index}`}
            postName={result.title.rendered}
            post={result}
            handleClick={handleEvent}
          />
        ))}
      </ul>
    </div>
  );
}

export const Item = ({ handleClick, post, postName, isActive }) => {

  console.log(handleClick, post, postName);

  // Set classname if post.id exists in selected posts.
  function className() {
    // If current post is in selectedPosts.
    if (post && undefined !== isActive) {
      if (isActive.filter(e => e.id === post.id).length > 0) {
        return post.slug + ' is-selected';
      }

      return post.slug;
    }
  }

  /* eslint-disable */
  return <li className={className()} onClick={((e) => handleClick({ e, post }))}> {postName} </li>;
}
