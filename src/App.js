import logo from './logo.svg';

import Sidebar from './sidebar';
import Feed from './feed';
import Widgets from './widgets';

import './App.css'

function App() {
  return (
    <div className="app">
     <Sidebar />
     <Feed />
     <Widgets />
    </div>
  );
}

export default App;
