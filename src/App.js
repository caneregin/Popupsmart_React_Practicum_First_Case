import logo from './logo.svg';
import './App.css';
import Todo from './components/Todo';
import Navi from './components/Navi';

function App() {
  return (
    <div className="App">
      <Navi/>
      <Todo/>
    </div>
  );
}

export default App;
