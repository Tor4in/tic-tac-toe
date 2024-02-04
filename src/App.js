import { useRef, useState } from "react";
import "./App.css";
import styles from "./map.module.css";
function calculateWinner(value) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (value[a] && value[a] === value[b] && value[a] === value[c]) {
      return value[a];
    }
  }
  return null;
}
let addToStorage = (e, stats)=>{
	if(calculateWinner(e) === 'x'){
		localStorage.setItem('x', (stats.x).toString())
	}else{
		localStorage.setItem('o', (stats.o).toString())
	}
}
function App() {
  let [isX, setPlayer] = useState(true);
  let [rect, setRect] = useState(Array(9).fill(null));
	{
		let add = (e)=>{
			if(localStorage.getItem(e) == null){
				localStorage.setItem(e, 0)
			}
		}
		add('x')
		add('o')
		add('d')
	}
	let [gameStats, setStats] = useState({x: parseInt(localStorage.getItem('x')),o:parseInt(localStorage.getItem('o')),d:parseInt(localStorage.getItem('d'))})
	let [move, setMove] = useState(0)
	let [p, setP] = useState('Next player: X')
	let [game, setGame] = useState(true)
  let nextPlayer = (e) => {
    if (!e.target.classList.contains(`${styles.active}`) && game) {
      e.target.classList.add(`${styles.active}`);
      if (isX) {
        e.target.classList.add(`${styles.x}`);
				setP('Next player: O')
      } else {
        e.target.classList.add(`${styles.o}`);
				setP('Next player: X')
      }
      setPlayer(!isX);
      let nextMoveList = rect.slice();
      isX
        ? (nextMoveList[e.target.attributes[1].value] = "x")
        : (nextMoveList[e.target.attributes[1].value] = "0");
			
			if(calculateWinner(nextMoveList) != null){
				setP(`Player ${calculateWinner(nextMoveList)} WON!!!!`)
				setGame(false)
				if(calculateWinner(nextMoveList) === 'x'){
					setStats({...gameStats, x: gameStats.x+=1}) 
				}else {
					setStats({...gameStats, o: gameStats.o+=1})
				}
				// addToStorage(nextMoveList, gameStats)
			}else {
				setMove(e => e+=1)
			}
			if(move === 8){
				setStats({...gameStats, d: gameStats.d+=1})
				localStorage.setItem('d', (gameStats.d).toString())
				setP(`Draw(((`)
			}
      setRect(nextMoveList);
    }
  };
	let map = useRef(null)
	let reset = ()=>{
		for (const e of map.current.children) {
			if(e.classList.contains(`${styles.active}`) ) {
				e.classList.add(`${styles.close}`)
				setTimeout(() => {
					e.classList = `${styles.rect}`
				}, 400);
			}
		}
		setMove(0)
		setRect(Array(9).fill(null))
		setGame(true)
		setPlayer(true)
		setP('Next player: X')
	}
	let clear = ()=>{
		setStats({x: 0, o:0,d:0})
		localStorage.clear()
	}
  return (
    <>
      <div className={styles.topBar}>
        <p className={styles.next_player}>{p}</p>
        <button className={styles.reset} onClick={reset}>
          Resset
        </button>
      </div>
      <div className={styles.map} ref={map}>
        {rect.map((e, index) => (
          <button
            className={styles.rect}
            key={index}
            data-index={index}
            onClick={nextPlayer}
          >
            {e}
          </button>
        ))}
      </div>
      <div className={styles.stats}>
        <p>X wins: {gameStats.x}</p>
        <p>O wins: {gameStats.o}</p>
        <p>draws: {gameStats.d}</p>
        <button className={styles.reset} onClick={clear}>
          Clear stats
        </button>
      </div>
    </>
  );
}

export default App;
