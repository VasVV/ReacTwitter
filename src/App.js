import logo from './logo.svg';
import Register from './register';
import Login from './login';
import Sidebar from './sidebar';
import Feed from './feed';
import Widgets from './widgets';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css'
import RegisterForm from './registerform';
import RegisterTwo from './registertwo';
import Profile from './profile';

function App() {
  return (
    
     
     <Router>
       <Switch>
         <Route path='/dashboard'>
         <div className="app">
          <Sidebar />
          <Feed />
          <Widgets />
          </div>
         </Route>
         <Route path='/register'>
           <Register />
         </Route>
         <Route path='/login'>
           <Login />
         </Route>
         <Route path='/registerform'>
           <RegisterForm />
         </Route>
         <Route path='/registertwo'>
           <RegisterTwo />
         </Route>
         <Route path='/profile'>
           <Profile />
         </Route>
       </Switch>
     </Router>
    
  );
}

export default App;
