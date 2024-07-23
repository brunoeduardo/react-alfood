import { Routes, Route } from 'react-router-dom';
import Home from './paginas/Home';
import VitrineRestaurantes from './paginas/VitrineRestaurantes';
import AdminRestaurantes from './paginas/Admin/Restaurantes/AdminRestaurantes';
import FormRestaurante from './paginas/Admin/Restaurantes/FormRestaurante';
import AdminTemplate from './paginas/Admin/Template/AdminTemplate';
import AdminPratos from './paginas/Admin/Pratos/AdminPratos';
import FormPratos from './paginas/Admin/Pratos/FormPratos';


function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurantes" element={<VitrineRestaurantes />} />
      <Route path='/admin' element={<AdminTemplate />}>
        <Route path="restaurantes" element={<AdminRestaurantes />} />
        <Route path="restaurantes/novo" element={<FormRestaurante />} />
        <Route path="restaurantes/:id" element={<FormRestaurante />} />
        <Route path="pratos" element={<AdminPratos />} />
        <Route path="pratos/novo" element={<FormPratos />} />
        <Route path="pratos/:id" element={<FormPratos />} />
      </Route>
    </Routes>
  );
}

export default App;
