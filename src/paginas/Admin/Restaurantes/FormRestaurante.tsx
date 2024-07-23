import { Box, Button, TextField, Typography } from "@mui/material"

import { useEffect, useState } from "react";
import IRestaurante from "../../../interfaces/IRestaurante";
import { useNavigate, useParams } from "react-router-dom";
import httpAdmin from "../../../http";

const FormRestaurante = () => {
    const urlParam = useParams();

    useEffect(() => {
        if (urlParam.id) {
            httpAdmin.get<IRestaurante>(`restaurantes/${urlParam.id}/`)
                .then((result) => setRestauranteNome(result.data.nome))
        }
    }, [urlParam])

    const [restauranteNome, setRestauranteNome] = useState<string>('')

    const navigate = useNavigate();

    const enviarDados = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (urlParam.id) {
            httpAdmin.patch<IRestaurante>(`restaurantes/${urlParam.id}/`, {
                "nome": restauranteNome
            }).then(
                () => console.log('Cadastro atualizado com sucesso!')
            )
        } else {
            httpAdmin.post<IRestaurante>('restaurantes/', {
                "nome": restauranteNome
            }).then(
                () => console.log('Cadastro realizado com sucesso!')
            )
        }
    }

    const deletarRestaurante = () => {
        if (!urlParam.id) return;

        httpAdmin.delete(`restaurantes/${urlParam.id}/`).then(
            () => {
                console.log('Cadastro deletado com sucesso!')
                navigate("/admin/restaurantes")
            }
        )
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography component="h1" variant="h6">Formulário de Restaurantes</Typography>
            <Box component="form" onSubmit={enviarDados}>
                <TextField required value={restauranteNome} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setRestauranteNome(event.target.value);
                }} label="Nome restaurante" variant="outlined" fullWidth />
                <Button sx={{ marginTop: 1 }} type="submit" variant="outlined" fullWidth>Salvar</Button>
                <br />
                <Button sx={{ marginTop: 1 }} fullWidth variant="text" color="error" onClick={() => deletarRestaurante()} disabled={!urlParam.id}>Deletar restaurante</Button>
            </Box>
        </Box>
    )
}

export default FormRestaurante