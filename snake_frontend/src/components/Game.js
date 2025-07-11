import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED = 150;

const Game = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (gameOver) {
      resetGame();
    }
    setIsPlaying(!isPlaying);
  };

  const checkCollision = useCallback((head) => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }

    // Self collision
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }

    return false;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (checkCollision(head)) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, isPlaying, gameOver, score, checkCollision, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          togglePlay();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="game-container">
      <div className="score-board">
        Score: {score}
      </div>
      <div className="game-board">
        {Array(GRID_SIZE).fill().map((_, row) => (
          <div key={row} className="row">
            {Array(GRID_SIZE).fill().map((_, col) => {
              const isSnake = snake.some(segment => segment.x === col && segment.y === row);
              const isFood = food.x === col && food.y === row;
              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={togglePlay} className="control-button">
          {gameOver ? 'Restart' : isPlaying ? 'Pause' : 'Start'}
        </button>
        {gameOver && <div className="game-over">Game Over!</div>}
      </div>
    </div>
  );
};

export default Game;
