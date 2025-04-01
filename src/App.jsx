import React from 'react';
import { Routes, Route } from 'react-router';
import Home from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignUpPage';
import  HabitAdd from './components/HabitAdd';
import AboutPage from './components/AboutPage';
import ProfilePage from './components/ProfilePage';
import WelcomePage from './components/WelcomePage';
import HabitList from './components/HabitList'
import HabitEdit from './components/HabitEdit';
import JournalList from './components/JournalList';
import JournalEdit from './components/JournalEdit';
import JournalAdd from './components/JournalAdd';
import JournalView from './components/JournalView';
import HabitStats from './components/HabitStats';


const App = () =>{
  return(
    <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/habitadd" element={<HabitAdd />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/welcome" element={<WelcomePage />} />
    <Route path="/habitlist" element={<HabitList />} />
    <Route path="/habitedit" element={<HabitEdit />} />
    <Route path="/stats" element={<HabitStats />} />
    <Route path="/journallist" element={<JournalList />} />
    <Route path="/journaladd" element={<JournalAdd />} />
    <Route path="/journaledit" element={<JournalEdit />} />
    <Route path="/journalview/:id" element={<JournalView />} />
    </Routes>
  )
}

export default App