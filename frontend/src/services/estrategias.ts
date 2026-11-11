import { chamarApi } from '@/services/api';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  total?: number; 
}

export interface Estrategia {
  id: number;
  categoria_id?: number;
  titulo: string;
  descricao_curta: string;
  como_fazer?: string; 
  duracao_min: number;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
}

// Listagens públicas (não precisam de login)
export const listarCategorias = () => chamarApi<Categoria[]>('GET', '/categorias.php');

export const listarEstrategias = (categoriaId: string) =>
  chamarApi<{ categoria: Categoria; estrategias: Estrategia[] }>('GET', `/estrategias.php?categoria=${categoriaId}`);

//um único PHP para estratégia e categoria
export const buscarDetalhe = (tipo: string, id: string) =>
  chamarApi<Estrategia & Categoria>('GET', `/detalhe.php?tipo=${tipo}&id=${id}`);
