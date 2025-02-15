import { useQuery, gql, useMutation } from '@apollo/client';
import client from '../apolloClient';
import { useState } from 'react';
import Link from 'next/link';
import '../styles.css';


const GET_VEICULOS = gql`
  query GetVeiculos {
    veiculos {
      id
      modelo
      marca
      ano
      montadora {
        id
        nome
      }
    }
  }
`;

const GET_MONTADORAS = gql`
  query GetMontadoras {
    montadoras {
      id
      nome
    }
  }
`;

const ADD_VEICULO = gql`
  mutation AddVeiculo($modelo: String!, $marca: String!, $ano: Int!, $montadora_id: ID!) {
    addVeiculo(modelo: $modelo, marca: $marca, ano: $ano, montadora_id: $montadora_id) {
      id
      modelo
      marca
      ano
      montadora {
        id
        nome
      }
    }
  }
`;

const UPDATE_VEICULO = gql`
  mutation UpdateVeiculo($id: ID!, $modelo: String, $marca: String, $ano: Int, $montadora_id: ID) {
    updateVeiculo(id: $id, modelo: $modelo, marca: $marca, ano: $ano, montadora_id: $montadora_id) {
      id
      modelo
      marca
      ano
      montadora {
        id
        nome
      }
    }
  }
`;

const DELETE_VEICULO = gql`
  mutation DeleteVeiculo($id: ID!) {
    deleteVeiculo(id: $id)
  }
`;

function VeiculosPage() {
  const { loading, error, data, refetch } = useQuery(GET_VEICULOS, { client });
  const { loading: montadorasLoading, error: montadorasError, data: montadorasData } = useQuery(GET_MONTADORAS, { client });

  const [addVeiculo] = useMutation(ADD_VEICULO, {
    client,
    onCompleted: () => {
      setModelo('');
      setMarca('');
      setAno('');
      setMontadoraId('');
      refetch();
    }
  });

  const [updateVeiculo] = useMutation(UPDATE_VEICULO, {
    client,
    onCompleted: () => {
      setEditingVeiculo(null);
      refetch();
    }
  });

  const [deleteVeiculo] = useMutation(DELETE_VEICULO, {
    client,
    onCompleted: () => {
      refetch();
    }
  });

  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [ano, setAno] = useState('');
  const [montadoraId, setMontadoraId] = useState('');
  const [editingVeiculo, setEditingVeiculo] = useState(null);

  const handleAddVeiculo = (e) => {
    e.preventDefault();
    addVeiculo({ variables: { modelo, marca, ano: parseInt(ano), montadora_id: montadoraId } });
  };

  const handleUpdateVeiculo = (e) => {
    e.preventDefault();
    updateVeiculo({ variables: { id: editingVeiculo, modelo, marca, ano: parseInt(ano), montadora_id: montadoraId } });
  };

  const handleDeleteVeiculo = (id) => {
    deleteVeiculo({ variables: { id } });
  };

  if (loading || montadorasLoading) return <p>Carregando...</p>;
  if (error || montadorasError) return <p>Erro: {error?.message || montadorasError?.message}</p>;

  return (
    <div>
      <nav>
        <Link href="/">Voltar para Montadoras</Link>
      </nav>

      <h1>Adicionar Veículo</h1>
      <form onSubmit={editingVeiculo ? handleUpdateVeiculo : handleAddVeiculo}>
        <div>
          <label htmlFor="modelo">Modelo:</label>
          <input type="text" id="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
        </div>
        <div>
          <label htmlFor="marca">Marca:</label>
          <input type="text" id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ano">Ano:</label>
          <input type="number" id="ano" value={ano} onChange={(e) => setAno(e.target.value)} />
        </div>
        <div>
          <label htmlFor="montadora">Montadora:</label>
          <select value={montadoraId} onChange={(e) => setMontadoraId(e.target.value)}>
            <option value="">Selecione uma Montadora</option>
            {montadorasData?.montadoras?.map((montadora) => (
              <option key={montadora.id} value={montadora.id}>{montadora.nome}</option>
            ))}
          </select>
        </div>
        <button type="submit">{editingVeiculo ? "Salvar" : "Adicionar"}</button>
        {editingVeiculo && <button onClick={() => setEditingVeiculo(null)}>Cancelar</button>}
      </form>

      <h1>Lista de Veículos</h1>
      <ul>
        {data?.veiculos?.map((veiculo) => (
          <li key={veiculo.id}>
            {veiculo.modelo} - {veiculo.marca} ({veiculo.ano}) - Montadora: {veiculo.montadora ? veiculo.montadora.nome : "Desconhecida"}
            <button onClick={() => {
              setModelo(veiculo.modelo);
              setMarca(veiculo.marca);
              setAno(veiculo.ano);
              setMontadoraId(veiculo.montadora?.id || '');
              setEditingVeiculo(veiculo.id);
            }}>Editar</button>
            <button onClick={() => handleDeleteVeiculo(veiculo.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VeiculosPage;
