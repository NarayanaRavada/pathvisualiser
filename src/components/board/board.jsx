import React, { Component } from "react";
import Node from "../node/node";

import "./board.styles.scss";

import Bfs from "../../assests/bfs";

const size = {
  rows: 10,
  cols: 20,
};

let START_NODE_ROW = Math.floor(Math.random() * size.rows);
let START_NODE_COL = Math.floor(Math.random() * size.cols);
let END_NODE_ROW = Math.floor(Math.random() * size.rows);
let END_NODE_COL = Math.floor(Math.random() * size.cols);

class PathFindingVisualliser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: [],
      mouseIsPressed: false,
      currStatus: "normal",
    };
  }

  componentDidMount() {
    const grid = getGridInit();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const { grid } = this.state;
    console.log(this.state);
    const newGrid = nodeWallToggle(grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const { currStatus } = this.state;
    let { grid } = this.state;
    const node = grid[row][col];
    if (node.status == "start") {
      node.status = "normal";
      node.isStart = false;
      this.setState({ grid, currStatus: "start" });
      return;
    } else if (node.status == "end") {
      node.status = "normal";
      node.isEnd = false;
      this.setState({ grid, currStatus: "end" });
      return;
    } else {
      if (currStatus == "normal") {
        grid = nodeWallToggle(grid, row, col);
        this.setState({ grid: grid });
      } else if (currStatus == "start") {
        node.status = "start";
        node.isStart = true;
      } else {
        node.status = "end";
        node.isEnd = true;
      }
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  reset() {
    const { grid } = this.state;
    for (let row = 0; row < size.rows; row++) {
      for (let col = 0; col < size.cols; col++) {
        if (!grid[row][col].isStart && !grid[row][col].isEnd)
          document.getElementById(`node-${row}-${col}`).className = "node";
      }
    }
    this.setState({ grid: getGridInit() });
  }

  animateBfs(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length && nodesInShortestPathOrder !== []) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * Math.sqrt(i) + 10);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node visited-node";
      }, 10 * Math.sqrt(i));
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        let cls = "";
        if (i == 0) {
          cls = "start-node";
        } else if (i == nodesInShortestPathOrder.length - 1) {
          cls = "end-node";
        } else {
          cls += "path";
        }
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `node ${cls}`;
      }, 50 * i);
    }
  }

  visualiseBfs() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[END_NODE_ROW][END_NODE_COL];
    const { visitedInOrder, path } = Bfs(grid, startNode, endNode);
    console.log(path);
    if (path == null) {
      alert("No Path found");
      return;
    }

    this.animateBfs(visitedInOrder, path);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div className="board">
        <h1>Path Finding visualiser</h1>
        {grid.map((row, rowIdx) => (
          <div className="row" key={rowIdx}>
            {row.map((node, nodeIdx) => (
              <Node
                key={nodeIdx}
                {...node}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                onMouseUp={() => this.handleMouseUp()}
              />
            ))}
          </div>
        ))}
        <div className="row">
          <button onClick={() => this.visualiseBfs()}>Visualise Bfs</button>
          <button onClick={() => this.reset()}>reset</button>
        </div>
      </div>
    );
  }
}

const getGridInit = () => {
  START_NODE_ROW = Math.floor(Math.random() * size.rows);
  START_NODE_COL = Math.floor(Math.random() * size.cols);
  END_NODE_ROW = Math.floor(Math.random() * size.rows);
  END_NODE_COL = Math.floor(Math.random() * size.cols);
  const grid = [];
  for (let row = 0; row < size.rows; row++) {
    const currRow = [];
    for (let col = 0; col < size.cols; col++) {
      currRow.push(createNode(col, row));
    }
    grid.push(currRow);
  }

  return grid;
};

const createNode = (col, row) => {
  const Node = {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isEnd: row === END_NODE_ROW && col === END_NODE_COL,
    isVisited: false,
    isWall: false,
    prevNode: null,
  };
  Node.status = Node.isStart ? "start" : Node.isEnd ? "end" : "normal";
  return Node;
};

const nodeWallToggle = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default PathFindingVisualliser;
