import { useQuery, gql, useMutation } from '@apollo/client';
import client from '../apolloClient';
import { useState } from 'react';
import Link from 'next/link';


const GET_MONTADORAS = gql`
  query GetMontadoras {
    montadoras {
      id
      nome
    }
  }
`;

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

const ADD_VEICULO = gql`
  mutation AddVeiculo($modelo: String!, $marca: String!, $ano: Int, $montadora_id: ID!) {
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
  const { loading: loadingVeiculos, error: errorVeiculos, data: dataVeiculos } = useQuery(GET_VEICULOS, { client });
  const { loading, error, data } = useQuery(GET_MONTADORAS, { client });

  const [addVeiculoMutation] = useMutation(ADD_VEICULO, {
    client,
    onCompleted: () => {
      setModelo('');
      setMarca('');
      setAno('');
      setMontadoraId('');
      refetch();
    },
  });

  const [updateVeiculoMutation] = useMutation(UPDATE_VEICULO, {
    client,
    onCompleted: () => {
      setEditingVeiculo(null);
      refetch();
    },
  });

  const [deleteVeiculoMutation] = useMutation(DELETE_VEICULO, {
    client,
    onCompleted: () => {
      refetch();
    },
  });

  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [ano, setAno] = useState('');
  const [montadoraId, setMontadoraId] = useState('');
  const [editingVeiculo, setEditingVeiculo] = useState(null);

  const handleAddVeiculo = (e) => {
    e.preventDefault();
    console.log("handleAddVeiculo chamado");
    console.log("Dados do veículo:", { modelo, marca, ano, montadoraId });
    addVeiculoMutation({ variables: { modelo, marca, ano: ano ? parseInt(ano) : null, montadora_id: montadoraId } })
      .then(response => {
        console.log("Resposta do addVeiculoMutation:", response);
      })
      .catch(error => {
        console.error("Erro no addVeiculoMutation:", error);
      });
  };

  if (loadingVeiculos) return null;
  if (errorVeiculos) return <p>Erro ao carregar veículos: {errorVeiculos.message}</p>;

  return (
    <div>
        <>
  <nav>
    <Link href="/montadoras">Ir para Montadoras</Link>
  </nav>

  {/* O restante do código da página */}
</>
      <h1>Adicionar Veículo</h1>
      <form onSubmit={handleAddVeiculo}>
        <label>Modelo:</label>
        <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />

        <label>Marca:</label>
        <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />

        <label>Ano:</label>
        <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} />

        <label>Montadora:</label>
        <select value={montadoraId} onChange={(e) => setMontadoraId(e.target.value)}>
          <option value="">Selecione uma montadora</option>
          {data?.montadoras?.map((montadora) => (
            <option key={montadora.id} value={montadora.id}>
              {montadora.nome}
            </option>
          ))}
        </select>

        <button type="submit">Adicionar Veículo</button>
      </form>

      <h1>Lista de Veículos</h1>
      <ul>
        {dataVeiculos?.veiculos?.map((veiculo) => (
          <li key={veiculo.id}>
            {veiculo.modelo} - {veiculo.marca} ({veiculo.ano}) - {veiculo.montadora.nome}
          </li>
        ))}
      </ul>

      <h1>Editar Veículo</h1>
      <form>
        <label>Modelo:</label>
        <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />

        <label>Marca:</label>
        <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />

        <label>Ano:</label>
        <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} />

        <label>Montadora:</label>
        <select value={montadoraId} onChange={(e) => setMontadoraId(e.target.value)}>
          <option value="">Selecione uma montadora</option>
          {data?.montadoras?.map((montadora) => (
            <option key={montadora.id} value={montadora.id}>
              {montadora.nome}
            </option>
          ))}
        </select>

        <button type="submit">Salvar</button>
        <button type="button" onClick={() => setEditingVeiculo(null)}>Cancelar</button>
      </form>
    </div>
  );
}

export default VeiculosPage;
