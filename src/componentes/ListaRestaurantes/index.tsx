import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

interface IPesquisa {
  search?: string
  ordering?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [nextPage, setNextPage] = useState<string>("")
  const [previous, setPrevious] = useState<string>("")
  const [filtro, setFiltro] = useState<string>("")

  useEffect(() => {
    axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/')
      .then(result => {
        setRestaurantes(result.data.results)
        setNextPage(result.data.next)
      })
      .catch(error => console.log(error))
  }, [])

  const proximaPagina = () => {
    if (!nextPage) return;

    axios.get<IPaginacao<IRestaurante>>(nextPage)
      .then(result => {
        setRestaurantes(result.data.results)
        setNextPage(result.data.next)
        setPrevious(result.data.previous)
      })
      .catch(error => console.log(error))
  }

  const anteriorPagina = () => {
    if (!previous) return;

    axios.get<IPaginacao<IRestaurante>>(previous)
      .then(result => {
        setRestaurantes(result.data.results)
        setNextPage(result.data.next)
        setPrevious(result.data.previous)
      })
      .catch(error => console.log(error))
  }

  const aplicarFiltro = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios.get<IPaginacao<IRestaurante>>(`http://localhost:8000/api/v1/restaurantes/?search=${filtro}`)
      .then(result => {
        setRestaurantes(result.data.results)
        setNextPage(result.data.next)
        setPrevious(result.data.previous)
      })
      .catch(error => console.log(error))

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

    <button onClick={anteriorPagina} disabled={!previous}>Anterior</button>
    <button onClick={proximaPagina} disabled={!nextPage}>Próxima</button>

  </section>)
}

export default ListaRestaurantes