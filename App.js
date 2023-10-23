import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
  const [chaveDeBusca, setChaveDeBusca] = useState('');
  const [livros, setLivros] = useState([]);

  const buscarLivros = async () => {
    try {
      const url = `https://hn.algolia.com/api/v1/search?query=${chaveDeBusca}`;

      const response = await axios.get(url);

      const dados = response.data;

      setLivros(dados.hits);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  };

  const classificarLivro = (livro, novaClassificacao) => {
    const novosLivros = livros.map((l) => {
      if (l === livro) {
        l.classificacao = novaClassificacao;
      }
      return l;
    });
    setLivros(novosLivros);
  };

  const renderEstrelas = (livro) => {
    const classificacao = livro.classificacao || 0;
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <Icon
          key={i}
          name={classificacao >= i ? 'star' : 'star-o'}
          size={20}
          color={classificacao >= i ? 'gold' : 'black'}
          onPress={() => classificarLivro(livro, i)}
        />
      );
    }
    return estrelas;
  };

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 30 }}>Busca de Livros</Text>
      <TextInput
        placeholder="Chave de busca"
        value={chaveDeBusca}
        onChangeText={(text) => setChaveDeBusca(text)}
        style={{ borderWidth: 1, margin: 10, padding: 10 }}
      />
      <Button title="Pesquisar" onPress={buscarLivros} />

      <ScrollView style={{ marginTop: 20 }}>
        {livros.map((livro) => (
          <View key={livro.objectID} style={{ borderWidth: 1, borderRadius: 6, margin: 10, padding: 10, backgroundColor: '#97a6de' }}>
            <Text style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="book" size={16} color="black" style={{ marginRight: 5 }} />:
              {livro.title || 'Título não disponível'}
            </Text>
            <Text style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="user" size={16} color="black" style={{ marginRight: 5 }} />:
              {livro.author || 'Autor não disponível'}
            </Text>
            <Text style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="link" size={16} color="black" style={{ marginRight: 10 }} />:
              {livro.url || 'Url não disponível'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              {renderEstrelas(livro || 0)}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
