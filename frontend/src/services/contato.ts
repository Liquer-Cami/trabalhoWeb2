import { chamarApi } from "./api";

export interface ContatoDados {
    nome: string;
    email: string;
    assunto: string;
    mensagem: string;
}

export async function enviarContato(dados: ContatoDados) {
    return chamarApi('POST', "/contato.php", dados);
}
