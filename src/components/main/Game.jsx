// -----------------------------------------------------------------------------
// Node Modules ----------------------------------------------------------------
import React from 'react';
import classNames from 'classnames';
// -----------------------------------------------------------------------------
// Style -----------------------------------------------------------------------
import styles from './Game.scss';
// -----------------------------------------------------------------------------
// Helpers ---------------------------------------------------------------------
import {
  Cell,
  GameState,
  makeNewGame,
  updateGame,
  toggleGameFlag,
} from '@/helpers/functions';
import env from '@/helpers/env';
//------------------------------------------------------------------------------
// React Class -----------------------------------------------------------------
class Game extends React.Component {
  static getCellValue = (it) => {
    if (it.visible) {
      return it.value === Cell.BOMB ? '💣' : it.value === 0 ? '' : it.value;
    }

    return it.flagged ? '🚩' : '';
  };

  static Board = ({ grid, highlight, onMakeMove, onFlag }) => (
    <div className={styles.Board}>
      {grid.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className={styles.row}>
          {row.map((it, colIndex) => (
            <div
              key={`cell-${rowIndex}_${colIndex}`}
              className={classNames(styles.cell, {
                [styles.hidden]: !it.visible,
                [styles[`count--${it.value}`]]: it.visible,
                [styles.highlight]:
                  colIndex === highlight.x && rowIndex === highlight.y,
              })}
              onClick={(event) =>
                onMakeMove(event, { x: colIndex, y: rowIndex })
              }
              onContextMenu={(event) =>
                onFlag(event, { x: colIndex, y: rowIndex })
              }
            >
              {Game.getCellValue(it)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  state = {
    game: null,
    difficulty: 'easy',
  };

  componentDidMount() {
    this.resetGame();

    if (env.NODE_ENV === 'development') {
      window.game = this.state.game;
    }
  }

  handleMove = (event, pos) => {
    const { game } = this.state;
    this.setState({ game: updateGame(game, pos) });
  };

  handleFlag = (event, pos) => {
    const { game } = this.state;
    this.setState({ game: toggleGameFlag(game, pos) });
    event.preventDefault();
  };

  resetGame = (event) => {
    const { difficulty } = this.state;

    const gridSizeForDifficulty = {
      easy: 12,
      medium: 16,
      hard: 24,
    };

    const percentForDifficulty = {
      easy: 0.1,
      medium: 0.2,
      hard: 0.3,
    };

    const dim = gridSizeForDifficulty[difficulty];
    const percent = percentForDifficulty[difficulty];

    const size = { width: dim, height: dim };

    const bombCount = Math.floor(size.width * size.height * percent);
    const game = makeNewGame(size, bombCount);

    this.setState({ game });
  };

  changeDifficulty = (event) => {
    const difficulty = event.target.value;
    this.setState({ difficulty }, this.resetGame);
  };

  render() {
    const { className } = this.props;
    const { grid, lastPos, state, moves } = this.state.game || {};

    const didWin = state === GameState.WIN;
    const gameIsOver = didWin || state === GameState.GAME_OVER;

    const cn = classNames(styles.Game, className, {});

    return (
      <div className={cn}>
        {gameIsOver && (
          <div className={styles.modal}>
            {<h3>{didWin ? 'You Win!' : 'You Lose!'}</h3>}
          </div>
        )}

        {grid && (
          <Game.Board
            grid={grid}
            highlight={lastPos}
            onMakeMove={this.handleMove}
            onFlag={this.handleFlag}
          />
        )}

        <div className={styles.footer}>
          <select name="difficulty" onChange={this.changeDifficulty}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <span>Moves: {moves}</span>
          <a onClick={this.resetGame}>Reset</a>
        </div>
      </div>
    );
  }
}
//------------------------------------------------------------------------------
// Export ----------------------------------------------------------------------
export default Game;
