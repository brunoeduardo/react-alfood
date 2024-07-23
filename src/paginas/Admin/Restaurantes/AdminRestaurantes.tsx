import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "axios";
import IRestaurante from "../../../interfaces/IRestaurante";
import { Link } from "react-router-dom";

const AdminRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  useEffect(() => {
    axios.get<IRestaurante[]>('http://localhost:8000/api/v2/restaurantes/')
      .then(result => {
        setRestaurantes(result.data)
      })
      .catch(error => console.log(error))
  }, [])


  const deletarRestaurante = (id: number) => {
    axios.delete(`http://localhost:8000/api/v2/restaurantes/${id}/`).then(
      () => {
        const listaRestaurantes = restaurantes.filter(restaurante => restaurante.id !== id)
        setRestaurantes(listaRestaurantes)
      }
    )
  }


  return (
    <>
      <Link to={"/admin/restaurantes/novo"}>Novo restaurante</Link>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurantes.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">{row.nome}       </TableCell>
              <TableCell component="th" scope="row"> <Link to={`/admin/restaurantes/${row.id}`}> [ Editar ] </Link>  </TableCell>
              <TableCell component="th" scope="row"> <Button variant="outlined" color="error" onClick={() => deletarRestaurante(row.id)}>EXCLUIR </Button> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default AdminRestaurantes