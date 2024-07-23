import { Button, TextField } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react";
import IRestaurante from "../../../interfaces/IRestaurante";
import { useNavigate, useParams } from "react-router-dom";

const FormRestaurante = () => {
    const urlParam = useParams();

    useEffect(() => {
        if (urlParam.id) {
            axios.get<IRestaurante>(`http://localhost:8000/api/v2/restaurantes/${urlParam.id}/`)
                .then((result) => setRestauranteNome(result.data.nome))
        }
    }, [urlParam])

    const [restauranteNome, setRestauranteNome] = useState<string>('')

    const navigate = useNavigate();

    const enviarDados = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (urlParam.id) {
            axios.patch<IRestaurante>(`http://localhost:8000/api/v2/restaurantes/${urlParam.id}/`, {
                "nome": restauranteNome
            }).then(
                () => console.log('Cadastro atualizado com sucesso!')
            )
        } else {
            axios.post<IRestaurante>('http://localhost:8000/api/v2/restaurantes/', {
                "nome": restauranteNome
            }).then(
                () => console.log('Cadastro realizado com sucesso!')
            )
        }
    }

    const deletarRestaurante = () => {
        if (!urlParam.id) return;

        axios.delete(`http://localhost:8000/api/v2/restaurantes/${urlParam.id}/`).then(
            () => {
                console.log('Cadastro deletado com sucesso!')
                navigate("/admin/restaurantes")
            }
        )
    }

    return (
        <form onSubmit={enviarDados}>
            <TextField value={restauranteNome} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setRestauranteNome(event.target.value);
            }} label="Nome restaurante" variant="outlined" />
            <Button type="submit" variant="text">Salvar</Button>
            <br />
            <Button variant="text" onClick={() => deletarRestaurante()} disabled={!urlParam.id}>Deletar restaurante</Button>
        </form>
    )
}

export default FormRestaurante