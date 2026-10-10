import { useState } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('')

  function handleClick(value) {
    setDisplay(display + value);
  }


  function solveStringMath(expression) {
    try {
      
      const sanitized = expression.replace(/\b0+(\d+)/g, '\$1');

      setDisplay(new Function(`return ${sanitized}`)());
    } catch (error) {
      setDisplay("Invalid expression");
    }
  }


  return (
    <main id="center">
      <section id="calculator">

        {/* Display */}
        <div id="display">
          {display}
        </div>

        {/* Buttons */}
        <div id="buttons">
          <div>
            <button type="button" onClick={() => handleClick(1)} >
              1
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick(2)} >
              2
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick(3)} >
              3
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick(4)} >
              4
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick(5)} >
              5
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick(6)} >
              6
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick(7)} >
              7
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick(8)} >
              8
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick(9)} >
              9
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick(0)} >
              0
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick("*")} >
              X
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick("+")} >
              +
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick("-")} >
              -
            </button>
          </div>
          <div>
            <button type="button" onClick={() => handleClick("/")} >
              /
            </button>
          </div>
          <div>
            <button type="button" onClick={() => setDisplay(display.slice(0, -1))} >
              DEL
            </button>
          </div>
          <div>
            <button type="button" onClick={() => setDisplay('')} >
              AC
            </button>
          </div>

          <div>
            <button type="button" onClick={() => solveStringMath(display)} >
              =
            </button>
          </div>
        </div>

      </section>
    </main>
  )
}

export default App