import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';


const ListaRestaurantes = () => {
  const urlDefault = 'http://localhost:8000/api/v1/restaurantes/'
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [nextPage, setNextPage] = useState<string>("")
  const [previousPage, setPrevious] = useState<string>("")
  const [filtro, setFiltro] = useState<string>("")

  useEffect(() => {
    carregarDadosApi(urlDefault)
  }, [])

  const carregarDadosApi = (url: string, opcoes?: any) => {
    axios.get<IPaginacao<IRestaurante>>(url)
      .then(result => {
        setRestaurantes(result.data.results)
        setNextPage(result.data.next)
        setPrevious(result.data.previous)
      })
      .catch(error => console.log(error))
  }

  const paginacao = (tipoBusca: string) => {
    if (!tipoBusca) return;
    carregarDadosApi(tipoBusca)
  }

  const aplicarFiltro = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const options = `?search=${filtro}`
    carregarDadosApi(urlDefault + options)
  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <form onSubmit={aplicarFiltro}>
      <input type="text" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
      }} />
      <button type='submit'>Filtrar</button>
    </form>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}

    <button onClick={() => paginacao(previousPage)} disabled={!previousPage}>Anterior</button>
    <button onClick={() => paginacao(nextPage)} disabled={!nextPage}>Próxima</button>

  </section>)
}

export default ListaRestaurantes