import { useState } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('')

  // CHANGE 1: Use a functional state update.
  // This always appends to the latest state.
  function handleClick(value) {
    setDisplay(previous => {
      // Start a new expression after an error.
      if (
        previous === 'Invalid expression' ||
        previous === 'Cannot divide by zero'
      ) {
        return String(value)
      }

      const input = String(value)
      const lastChar = previous.slice(-1)
      const operators = ['+', '-', '*', '/']

      // Prevent consecutive operators.
      if (
        operators.includes(input) &&
        operators.includes(lastChar)
      ) {
        return previous
      }

      return previous + input
    })
  }

  // CHANGE 4: Handle decimal input separately.
  // Each number can contain only one decimal point.
  function handleDecimal() {
    setDisplay(previous => {
      if (
        previous === 'Invalid expression' ||
        previous === 'Cannot divide by zero'
      ) {
        return '0.'
      }

      // Find the current number after the last operator.
      const lastOperatorIndex = Math.max(
        previous.lastIndexOf('+'),
        previous.lastIndexOf('-'),
        previous.lastIndexOf('*'),
        previous.lastIndexOf('/')
      )

      const currentNumber = previous.slice(lastOperatorIndex + 1)

      // Do not add another decimal point to the same number.
      if (currentNumber.includes('.')) {
        return previous
      }

      // Start a decimal number with 0.
      if (previous === '' || /[+\-*/]$/.test(previous)) {
        return previous + '0.'
      }

      return previous + '.'
    })
  }

  // CHANGE 5: Delete the last character.
  // Use a functional update to avoid stale state.
  function handleDelete() {
    setDisplay(previous => {
      if (
        previous === 'Invalid expression' ||
        previous === 'Cannot divide by zero'
      ) {
        return ''
      }

      return previous.slice(0, -1)
    })
  }

  // CHANGE 6: Clear the entire expression.
  function handleClear() {
    setDisplay('')
  }

  // CHANGE 7: Validate and evaluate the expression safely.
  // This parser supports +, -, *, /, decimals, and parentheses.
  // It does not execute arbitrary JavaScript.
  function solveStringMath(expression) {
    if (!expression.trim()) {
      return
    }

    try {
      // Reject expressions that end with an operator.
      if (/[+\-*/.]$/.test(expression)) {
        throw new Error('Invalid expression')
      }

      // Allow only numbers, decimal points, operators,
      // whitespace, and parentheses.
      if (!/^[\d+\-*/().\s]+$/.test(expression)) {
        throw new Error('Invalid expression')
      }

      // Parse and evaluate using operator precedence.
      const result = evaluateExpression(expression)

      // CHANGE 8: Handle Infinity and NaN.
      if (!Number.isFinite(result)) {
        throw new Error('Cannot divide by zero')
      }

      // Avoid displaying floating-point artifacts such as
      // 0.30000000000000004.
      setDisplay(String(Number(result.toPrecision(12))))
    } catch (error) {
      setDisplay(
        error.message === 'Cannot divide by zero'
          ? 'Cannot divide by zero'
          : 'Invalid expression'
      )
    }
  }

  return (
    <main id="center">
      <section id="calculator">

        {/* Display */}
        <div id="display">
          {display || '0'}
        </div>

        {/* CHANGE 9: Buttons are direct grid children.
            Removed unnecessary wrapper divs. */}
        <div id="buttons">

          <button type="button" onClick={handleClear} className="clear">
            AC
          </button>

          <button type="button" onClick={handleDelete}>
            DEL
          </button>

          <button type="button" onClick={() => handleClick('/')}>
            /
          </button>

          <button type="button" onClick={() => handleClick('*')}>
            ×
          </button>

          <button type="button" onClick={() => handleClick('7')}>7</button>
          <button type="button" onClick={() => handleClick('8')}>8</button>
          <button type="button" onClick={() => handleClick('9')}>9</button>
          <button type="button" onClick={() => handleClick('-')}>−</button>

          <button type="button" onClick={() => handleClick('4')}>4</button>
          <button type="button" onClick={() => handleClick('5')}>5</button>
          <button type="button" onClick={() => handleClick('6')}>6</button>
          <button type="button" onClick={() => handleClick('+')}>+</button>

          <button type="button" onClick={() => handleClick('1')}>1</button>
          <button type="button" onClick={() => handleClick('2')}>2</button>
          <button type="button" onClick={() => handleClick('3')}>3</button>

          <button
            type="button"
            onClick={() => solveStringMath(display)}
            className="equals"
          >
            =
          </button>

          <button
            type="button"
            onClick={() => handleClick('0')}
            className="zero"
          >
            0
          </button>

          {/* CHANGE 10: Use a dedicated decimal handler. */}
          <button type="button" onClick={handleDecimal}>
            .
          </button>

        </div>
      </section>
    </main>
  )
}

// CHANGE 11: A recursive-descent arithmetic parser.
// It handles operator precedence without using eval() or new Function().

function evaluateExpression(expression) {
  let position = 0

  function skipWhitespace() {
    while (/\s/.test(expression[position] || '') && position < expression.length) {
      position++
    }
  }

  function parseExpression() {
    let value = parseTerm()

    while (true) {
      skipWhitespace()

      const operator = expression[position]

      if (operator !== '+' && operator !== '-') {
        break
      }

      position++

      const right = parseTerm()

      value = operator === '+'
        ? value + right
        : value - right
    }

    return value
  }

  function parseTerm() {
    let value = parseFactor()

    while (true) {
      skipWhitespace()

      const operator = expression[position]

      if (operator !== '*' && operator !== '/') {
        break
      }

      position++

      const right = parseFactor()

      if (operator === '/' && right === 0) {
        throw new Error('Cannot divide by zero')
      }

      value = operator === '*'
        ? value * right
        : value / right
    }

    return value
  }

  function parseFactor() {
    skipWhitespace()

    // Support unary plus and minus, including negative numbers.
    if (expression[position] === '-') {
      position++
      return -parseFactor()
    }

    if (expression[position] === '+') {
      position++
      return parseFactor()
    }

    // Support parentheses.
    if (expression[position] === '(') {
      position++

      const value = parseExpression()

      skipWhitespace()

      if (expression[position] !== ')') {
        throw new Error('Invalid expression')
      }

      position++
      return value
    }

    // Parse a number, including decimal numbers.
    const remaining = expression.slice(position)
    const match = remaining.match(/^(?:\d+\.?\d*|\.\d+)/)

    if (!match) {
      throw new Error('Invalid expression')
    }

    position += match[0].length

    return Number(match[0])
  }

  const result = parseExpression()

  skipWhitespace()

  // Reject any unconsumed or malformed input.
  if (position !== expression.length) {
    throw new Error('Invalid expression')
  }

  return result
}

export default App