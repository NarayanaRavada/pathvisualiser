import "./node.styles.scss";

const Node = (props) => {
  const {
    row,
    col,
    isEnd,
    isStart,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
  } = props;

  const otherClasses = isStart
    ? "start-node"
    : isEnd
    ? "end-node"
    : isWall
    ? "wall"
    : "";

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${otherClasses}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

export default Node;
