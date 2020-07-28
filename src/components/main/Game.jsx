// -----------------------------------------------------------------------------
// Node Modules ----------------------------------------------------------------
import React from 'react';
import classNames from 'classnames';
// -----------------------------------------------------------------------------
// Style -----------------------------------------------------------------------
import styles from './Game.scss';
//------------------------------------------------------------------------------
// Components ------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Helpers ---------------------------------------------------------------------
import {
  Cell,
  GameState,
  makeNewGame,
  updateGame,
  toggleGameFlag,
} from '@/helpers/functions';
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

  constructor(props) {
    super(props);

    const { size } = props;
    const bombCount = Math.floor(size.width * size.height * 0.2);
    this.state = { game: makeNewGame(size, bombCount) };

    window.game = this.state.game;
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

  render() {
    const { className } = this.props;
    const { grid, lastPos, state, moves } = this.state.game;

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
        <Game.Board
          grid={grid}
          highlight={lastPos}
          onMakeMove={this.handleMove}
          onFlag={this.handleFlag}
        />
        <div className={styles.footer}>Moves: {moves}</div>
      </div>
    );
  }
}
//------------------------------------------------------------------------------
// Export ----------------------------------------------------------------------
export default Game;
