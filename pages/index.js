import { useQuery, gql, useMutation } from '@apollo/client'; // Adicione useMutation
import client from '../apolloClient';
import { useState } from 'react'; // Importe useState
import Link from 'next/link';

const GET_MONTADORAS = gql`
  query GetMontadoras {
    montadoras {
      id
      nome
      endereco
    }
  }
`;

const ADD_MONTADORA = gql`
  mutation AddMontadora($nome: String!, $endereco: String) {
    addMontadora(nome: $nome, endereco: $endereco) {
      id
      nome
      endereco
    }
  }
`;

const DELETE_MONTADORA = gql`
  mutation DeleteMontadora($id: ID!) {
    deleteMontadora(id: $id)
  }
`;

const UPDATE_MONTADORA = gql`
  mutation UpdateMontadora($id: ID!, $nome: String, $endereco: String) {
    updateMontadora(id: $id, nome: $nome, endereco: $endereco) {
      id
      nome
      endereco
    }
  }
`;

function HomePage() {
  const { loading, error, data, refetch } = useQuery(GET_MONTADORAS, { client }); // Adicione refetch
  const [addMontadora, { loading: mutationLoading, error: mutationError }] = useMutation(ADD_MONTADORA, {
    client,
    onCompleted: () => {
      setNome('');
      setEndereco('');
      refetch(); // Atualiza a lista de montadoras após adicionar uma nova
    }
  });

  const [deleteMontadoraMutation] = useMutation(DELETE_MONTADORA, {
    client,
    onCompleted: () => {
      refetch(); // Atualiza a lista após a exclusão
    },
  });

  const [updateMontadoraMutation] = useMutation(UPDATE_MONTADORA, {
    client,
    onCompleted: () => {
      setEditingMontadora(null);
      refetch(); // Atualiza a lista após a atualização
    },
  });

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [editingMontadora, setEditingMontadora] = useState(null); // Novo estado para controlar a edição

  const handleAddMontadora = (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário
    addMontadora({ variables: { nome, endereco } });
  };

  const handleDeleteMontadora = (id) => {
    deleteMontadoraMutation({ variables: { id } });
  };

  const handleUpdateMontadora = (e, id) => {
    e.preventDefault();
    updateMontadoraMutation({ variables: { id: id, nome: nome, endereco: endereco } });
  };


  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <div>
        <>
  <nav>
    <Link href="/veiculos">Ir para Veículos</Link>
  </nav>

  {/* O restante do código da página */}
</>
      <h1>Adicionar Montadora</h1>
      <form onSubmit={handleAddMontadora}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endereco">Endereço:</label>
          <input
            type="text"
            id="endereco"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>
        <button type="submit">Adicionar</button>
      </form>
      <h1>Lista de Montadoras</h1>
      <ul>
        {data.montadoras.map((montadora) => (
          <li key={montadora.id}>
            {montadora.nome} ({montadora.endereco})
            <button onClick={() => setEditingMontadora(montadora.id)}>Editar</button>
            <button onClick={() => handleDeleteMontadora(montadora.id)}>Excluir</button>
          </li>
        ))}
      </ul>
      {editingMontadora && (
        <div>
          <h2>Editar Montadora</h2>
          <form onSubmit={(e) => handleUpdateMontadora(e, editingMontadora)}>
            <div>
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                value={data.montadoras.find(m => m.id === editingMontadora).nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endereco">Endereço:</label>
              <input
                type="text"
                id="endereco"
                value={data.montadoras.find(m => m.id === editingMontadora).endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </div>
            <button type="submit">Salvar</button>
            <button onClick={() => setEditingMontadora(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default HomePage;