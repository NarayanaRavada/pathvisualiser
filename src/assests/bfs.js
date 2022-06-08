const Bfs = (grid, startNode, endNode) => {
  const q = [];
  q.push(startNode);

  const visitedInOrder = [];

  while (q.length > 0) {
    if (endNode.isVisited) {
      let currNode = endNode;
      const path = [];
      while (currNode !== startNode) {
        path.unshift(currNode);
        currNode = currNode.prevNode;
      }
      path.unshift(currNode);
      return { visitedInOrder, path };
    }

    const node = q[0];
    node.isVisited = true;
    visitedInOrder.push(q.shift());

    const unvisitedNodes = getUnvisitedNeighbors(node, grid);
    for (let neighbour of unvisitedNodes) {
      if (!neighbour.isWall) {
        q.push(neighbour);
        neighbour.prevNode = node;
      }
    }
  }
};

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export default Bfs;
