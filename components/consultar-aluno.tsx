import { supabase } from "@/lib/supabase";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';

export default function ConsultarAluno() {
    const [alunos, setAlunos] = useState<any[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            carregarAlunos();
        }
    }, [isFocused]);

    async function carregarAlunos() {
        const { data, error } = await supabase
            .from("tb_aluno")
            .select("*")

        setAlunos(data || []);
    }

    async function editarAuluno(id: number,  nome: string){
        Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Erro ao editar aluno ' + id + nome,
        });
        router.push({pathname:'/(tabs)/cadastro', params: {id: id}});
        

    }

    async function excluirAuluno(id: number, nome: string){
        const { error } = await supabase
            .from("tb_aluno")
            .delete().eq("id", id)
        if(error){
            Toast.show({
                type: 'error',
                text1: 'Erro!',
                text2: 'Não foi possivel excluir o aluno.'
            })
        }else{
            Toast.show({
                type: 'sucess',
                text1: 'Sucesso!',
                text2: 'Aluno excluido com sucesso!'
            })
        }
        carregarAlunos();

        Toast.show({
            type: 'success', 
            text1: 'Sucesso',
            text2: 'Aluno excluído com sucesso ' + id + nome,
        });
    }

    return (
        <View style={styles.container}>
            <Text>Consultar Aluno</Text>
            <FlatList
                data={alunos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.id}</Text>
                        <Text>{item.nome}</Text>
                        <Text>{item.idade}</Text>
                        <Text>{item.email}</Text>

                        <TouchableOpacity onPress={() => editarAuluno(item.id, item.nome)}>
                            <Text>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => excluirAuluno(item.id, item.nome)}>
                            <Text>Exluir</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <Toast />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        
    }
});