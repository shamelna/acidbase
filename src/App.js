import React from 'react';
import { useAcidBase } from './hooks/useAcidBase.js';
import MainView from './components/MainView.jsx';

const App = () => {
  const state = useAcidBase();

  if (state.currentPage === 'about') {
    return <MainView {...state} />;
  }

  return <MainView {...state} />;
};

export default App;
