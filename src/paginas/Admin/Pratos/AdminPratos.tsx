import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import httpAdmin from "../../../http";
import IPrato from "../../../interfaces/IPrato";

const AdminPratos = () => {
    const [pratos, setPratos] = useState<IPrato[]>([]);

    useEffect(() => {
        httpAdmin.get<IPrato[]>('pratos/')
            .then(result => {
                setPratos(result.data)
            })
            .catch(error => console.log(error))
    }, [])

    const deletarPrato = (id: number) => {
        httpAdmin.delete(`pratos/${id}/`).then(
            () => {
                const listapratos = pratos.filter(prato => prato.id !== id)
                setPratos(listapratos)
            }
        )
    }

    return (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Tag</TableCell>
                    <TableCell>Imagem</TableCell>
                    <TableCell>Editar</TableCell>
                    <TableCell>Excluir</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {pratos.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell>{row.nome}       </TableCell>
                        <TableCell>{row.tag}       </TableCell>
                        <TableCell> [ <a href={row.imagem} target="_blank" rel="noreferrer" > ver imagem</a> ] </TableCell>
                        <TableCell> <Link to={`/admin/pratos/${row.id}`}> [ editar ] </Link>  </TableCell>
                        <TableCell> <Button variant="outlined" color="error" onClick={() => deletarPrato(row.id)}>EXCLUIR </Button> </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default AdminPratos