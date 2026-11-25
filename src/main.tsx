/**
 * O que este arquivo faz: ponto de entrada da aplicação React; monta o componente <App /> no HTML.
 * Quem usa: index.html (carregado pelo Vite).
 */
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
