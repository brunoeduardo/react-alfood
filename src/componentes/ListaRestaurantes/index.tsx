import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios, { AxiosRequestConfig } from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

interface IBusca {
  ordering?: string
  search?: string
}

const ListaRestaurantes = () => {
  const urlDefault = 'http://localhost:8000/api/v1/restaurantes/'
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [nextPage, setNextPage] = useState<string>("")
  const [previousPage, setPrevious] = useState<string>("")
  const [filtro, setFiltro] = useState<string>("")
  const [filtroOrder, setFiltroOrder] = useState<string>("")

  useEffect(() => {
    carregarDadosApi(urlDefault)
  }, [])

  const carregarDadosApi = (url: string, opcoes?: AxiosRequestConfig) => {
    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
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

    const opcoes = {
      params: {
      } as IBusca
    }

    if (filtro) opcoes.params.search = filtro
    if (filtroOrder) opcoes.params.ordering = filtroOrder

    carregarDadosApi(urlDefault, opcoes)
  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <form onSubmit={aplicarFiltro}>
      <input type="text" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
      }} />
      <select name="ordering" onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setFiltroOrder(event.target.value)}>
        <option value="">-- Ordenar por: --</option>
        <option value="nome">Nome</option>
        <option value="id">Id</option>
      </select>
      <button type='submit'>Filtrar</button>
    </form>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}

    <button onClick={() => paginacao(previousPage)} disabled={!previousPage}>Anterior</button>
    <button onClick={() => paginacao(nextPage)} disabled={!nextPage}>Próxima</button>

  </section>)
}

export default ListaRestaurantes