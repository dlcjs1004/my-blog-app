import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// App.tsx와 public/index.html을 연결해주는 파일
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


