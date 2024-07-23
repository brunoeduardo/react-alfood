import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import httpAdmin from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import ITags from "../../../interfaces/ITags";
import IRestaurante from "../../../interfaces/IRestaurante";


const FormPratos = () => {
    const urlParam = useParams();

    useEffect(() => {
        if (urlParam.id) {
            httpAdmin.get<IPrato>(`pratos/${urlParam.id}/`)
                .then((result) => {
                    setPratoNome(result.data.nome)
                    setPratoDescricao(result.data.descricao)
                    setPratoTag(result.data.tag)
                    setPratoImagem(null)
                    setPratoRestaurante(result.data.restaurante.toString())
                })
        } else {
            setPratoNome("")
            setPratoDescricao("")
            setPratoTag("")
            setPratoImagem(null)
            setPratoRestaurante("")
        }
    }, [urlParam])

    useEffect(() => {
        httpAdmin.get<{ tags: ITags[] }>("tags/")
            .then((result) => {
                setListaTags(result.data.tags)
            })

        httpAdmin.get<IRestaurante[]>("restaurantes/")
            .then(result => {
                setRestaurantes(result.data)
            })
            .catch(error => console.log(error))
    }, [])

    const [pratoNome, setPratoNome] = useState<string>("")
    const [pratoDescricao, setPratoDescricao] = useState<string>("")
    const [pratoTag, setPratoTag] = useState<string>("")
    const [pratoImagem, setPratoImagem] = useState<File | null>(null)
    const [pratoRestaurante, setPratoRestaurante] = useState<string>("")
    const [listaTags, setListaTags] = useState<ITags[]>([])
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

    const navigate = useNavigate();

    const enviarDados = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("nome", pratoNome)
        formData.append("tag", pratoTag)
        formData.append("descricao", pratoDescricao)
        formData.append("restaurante", pratoRestaurante)
        if (pratoImagem) {
            formData.append("imagem", pratoImagem)
        }

        if (urlParam.id) {
            httpAdmin.request({
                url: `pratos/${urlParam.id}/`,
                method: "PATCH",
                headers: {
                    "Content-Type": "multpart/form-data"
                },
                data: formData
            }).then(
                () => console.log("Prato atualizado com sucesso!")
            ).catch((error) => console.log(error))

        } else {
            httpAdmin.request({
                url: "pratos/",
                method: "POST",
                headers: {
                    "Content-Type": "multpart/form-data"
                },
                data: formData
            }).then(
                () => {
                    console.log("Prato cadastrado com sucesso!")
                    setPratoNome("")
                    setPratoDescricao("")
                    setPratoImagem(null)
                    setPratoTag("")
                    setPratoRestaurante("")
                }
            ).catch((error) => console.log(error))
        }
    }

    const deletarRestaurante = () => {
        if (!urlParam.id) return;

        httpAdmin.delete(`pratos/${urlParam.id}/`).then(
            () => {
                console.log("Cadastro deletado com sucesso!")
                navigate("/admin/pratos")
            }
        )
    }

    const carregarImagem = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            setPratoImagem(event.target.files[0])
        } else {
            setPratoImagem(null)
        }
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de pratos</Typography>
            <Box component="form" onSubmit={enviarDados} sx={{ width: "100%" }}>
                <TextField sx={{ marginBottom: 2 }} required value={pratoNome} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPratoNome(event.target.value);
                }} label="Nome prato" variant="outlined" fullWidth />
                <TextField sx={{ marginBottom: 2 }} required value={pratoDescricao} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPratoDescricao(event.target.value);
                }} label="Descriçao" variant="outlined" fullWidth />

                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="select-restaurante">Restaurante*</InputLabel>
                    <Select
                        required
                        value={pratoRestaurante.toString()}
                        labelId="select-restaurante"
                        onChange={(event: SelectChangeEvent<string>) => {
                            setPratoRestaurante(event.target.value);
                        }}>
                        {restaurantes.map((item: IRestaurante) => <MenuItem key={item.id} value={item.id}>{item.nome}</MenuItem>)}
                    </Select>
                </FormControl>

                <input type="file" onChange={carregarImagem} />

                <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
                    <InputLabel id="select-tag">Tag</InputLabel>
                    <Select
                        value={pratoTag}
                        labelId="select-tag"
                        onChange={(event: SelectChangeEvent<string>) => {
                            setPratoTag(event.target.value);
                        }}>
                        {listaTags.map((item: ITags) => <MenuItem key={item.id} value={item.value}>{item.value}</MenuItem>)}
                    </Select>
                </FormControl>

                <Button sx={{ marginTop: 1 }} type="submit" variant="outlined" fullWidth>Salvar</Button>
                <Button sx={{ marginTop: 1 }} fullWidth variant="text" color="error" onClick={() => deletarRestaurante()} disabled={!urlParam.id}>Deletar prato</Button>
            </Box>
        </Box>
    )
}

export default FormPratos