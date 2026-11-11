import { chamarApi } from '@/services/api';

export interface Checkin {
  id: string;
  usuario_id?: number | string;
  humor: string;
  fatores: string[];
  observacao: string;
  data: string;
}

export const listarCheckins = () => chamarApi<Checkin[]>('GET', '/checkin.php');

/**
 * Envia o payload de check‑in para o backend.
 * @param payload 
 * @returns
 */

export async function enviarCheckin(payload: {
  emoticon: string;
  fatores: string[];
  observacao: string;
}) {
  return await chamarApi('POST', '/checkin.php', payload);
}
