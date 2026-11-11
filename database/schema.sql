-- =====================================================================
-- Equilibra - banco de dados (MySQL)
-- Como usar: phpMyAdmin > Importar > escolha este arquivo.
-- Depois de importar, exporte de novo pelo phpMyAdmin para entregar.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS equilibra
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE equilibra;

-- ---------------------------------------------------------------------
-- 1) usuarios  (CADASTRO SIMPLES 1)
-- Guarda quem usa o sistema. A senha fica em hash (password_hash).
-- token_hash / token_expira servem para a recuperação de senha.
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  senha        VARCHAR(255) NOT NULL,
  foto         VARCHAR(255) NULL,          -- caminho do arquivo em backend/uploads
  token_hash   CHAR(64)     NULL,
  token_expira DATETIME     NULL,
  criado_em    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2) fatores_estresse  (CADASTRO SIMPLES 2)
-- Lista de fatores que a pessoa pode marcar no check-in (som alto, etc.).
-- ---------------------------------------------------------------------
CREATE TABLE fatores_estresse (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3) checkins  (RELAÇÃO 1..N: um usuário tem vários check-ins)
-- ---------------------------------------------------------------------
CREATE TABLE checkins (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  humor      ENUM('muito-bem','bem','neutro','mal','muito-mal') NOT NULL,
  observacao TEXT NULL,
  criado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4) checkin_fatores  (RELAÇÃO N..N 1: checkins <-> fatores_estresse)
-- Um check-in tem vários fatores e um fator aparece em vários check-ins.
-- ---------------------------------------------------------------------
CREATE TABLE checkin_fatores (
  checkin_id INT NOT NULL,
  fator_id   INT NOT NULL,
  PRIMARY KEY (checkin_id, fator_id),
  FOREIGN KEY (checkin_id) REFERENCES checkins(id) ON DELETE CASCADE,
  FOREIGN KEY (fator_id)   REFERENCES fatores_estresse(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5) tarefas  (RELAÇÃO 1..N: um usuário tem várias tarefas)
-- ---------------------------------------------------------------------
CREATE TABLE tarefas (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT NOT NULL,
  titulo          VARCHAR(150) NOT NULL,
  tempo_estimado  VARCHAR(10)  NOT NULL DEFAULT '',
  tempo_realizado VARCHAR(10)  NOT NULL DEFAULT '',
  prioridade      ENUM('Baixa','Média','Alta')  NOT NULL DEFAULT 'Baixa',
  dificuldade     ENUM('Fácil','Médio','Difícil') NOT NULL DEFAULT 'Fácil',
  recorrencia     ENUM('','Diária','Semanal','Mensal') NOT NULL DEFAULT '',
  concluida       TINYINT(1)   NOT NULL DEFAULT 0,
  observacao      TEXT NULL,
  data            DATE NOT NULL,
  criado_em       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6) tarefa_ocorrencias  (RELAÇÃO 1..N: tarefa -> dias concluídos)
-- Para tarefas que se repetem, guarda em quais dias foi concluída.
-- ---------------------------------------------------------------------
CREATE TABLE tarefa_ocorrencias (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  tarefa_id INT NOT NULL,
  data      DATE NOT NULL,
  UNIQUE (tarefa_id, data),
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7) tarefa_checkins  (RELAÇÃO N..N 2: tarefas <-> checkins)
-- Liga a tarefa ao(s) check-in(s) que a originaram (sugestão da IA).
-- ---------------------------------------------------------------------
CREATE TABLE tarefa_checkins (
  tarefa_id  INT NOT NULL,
  checkin_id INT NOT NULL,
  PRIMARY KEY (tarefa_id, checkin_id),
  FOREIGN KEY (tarefa_id)  REFERENCES tarefas(id)  ON DELETE CASCADE,
  FOREIGN KEY (checkin_id) REFERENCES checkins(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8) mensagens_contato  (tela Fale Conosco)
-- ---------------------------------------------------------------------
CREATE TABLE mensagens_contato (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL,
  assunto   VARCHAR(150) NOT NULL,
  mensagem  TEXT NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9) categorias  (LISTAGEM PÚBLICA 2)
-- ---------------------------------------------------------------------
CREATE TABLE categorias (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL UNIQUE,
  descricao VARCHAR(500) NOT NULL DEFAULT ''
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10) estrategias  (LISTAGEM PÚBLICA 1 - RELAÇÃO 1..N: uma categoria tem várias estratégias)
-- ---------------------------------------------------------------------
CREATE TABLE estrategias (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id    INT NOT NULL,
  titulo          VARCHAR(150) NOT NULL,
  descricao_curta TEXT NOT NULL,
  como_fazer      TEXT NOT NULL,              -- passo a passo (aparece só na tela de detalhe)
  duracao_min     SMALLINT UNSIGNED NOT NULL,
  dificuldade     ENUM('Fácil','Médio','Difícil') NOT NULL DEFAULT 'Fácil',
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Dados iniciais: fatores de estresse que já aparecem na tela
INSERT INTO fatores_estresse (nome) VALUES
  ('Som alto'), ('Trabalho'), ('Família'), ('Ansiedade'), ('Texturas');

-- Dados iniciais das listagens públicas
INSERT INTO categorias (nome, descricao) VALUES
  ('Respiração e calma', 'Exercícios rápidos para baixar a ansiedade.'),
  ('Sobrecarga sensorial', 'O que fazer quando o ambiente está barulhento ou agitado demais.'),
  ('Foco e organização', 'Ajuda para começar e terminar tarefas.'),
  ('Rotina e descanso', 'Pausas e hábitos para recuperar energia.');

INSERT INTO estrategias (categoria_id, titulo, descricao_curta, como_fazer, duracao_min, dificuldade) VALUES
  (1, 'Respiração 4-7-8', 'Inspire por 4 segundos, segure por 7 e solte o ar por 8.',
   '1. Sente-se com as costas apoiadas.\n2. Inspire pelo nariz contando até 4.\n3. Segure o ar contando até 7.\n4. Solte o ar pela boca devagar, contando até 8.\n5. Repita 4 vezes.', 2, 'Fácil'),
  (1, 'Técnica 5-4-3-2-1', 'Use os cinco sentidos para voltar ao momento presente.',
   '1. Diga 5 coisas que você vê.\n2. Toque em 4 coisas ao seu redor.\n3. Preste atenção em 3 sons.\n4. Perceba 2 cheiros.\n5. Note 1 gosto na boca.', 5, 'Fácil'),
  (2, 'Abafador ou fone', 'Diminua o barulho do ambiente para o corpo se acalmar.',
   '1. Coloque um fone com cancelamento de ruído ou um abafador.\n2. Se quiser, ponha um som calmo ou ruído branco baixinho.\n3. Fique assim até sentir que o incômodo passou.', 1, 'Fácil'),
  (2, 'Canto seguro', 'Vá para um lugar mais calmo e com pouca luz até se sentir melhor.',
   '1. Avise alguém de confiança, se precisar.\n2. Vá para um cômodo silencioso e apague ou diminua a luz.\n3. Use algo macio, como um cobertor ou almofada.\n4. Respire devagar e só volte quando estiver pronto.', 10, 'Médio'),
  (3, 'Pomodoro curto', 'Trabalhe 15 minutos e descanse 5. Comece com só um ciclo.',
   '1. Escolha uma única tarefa.\n2. Coloque um timer de 15 minutos e foque só nela.\n3. Quando tocar, descanse 5 minutos longe da tela.\n4. Se estiver bem, faça mais um ciclo.', 20, 'Médio'),
  (3, 'Dividir a tarefa', 'Quebre a tarefa em passos bem pequenos e faça só o primeiro.',
   '1. Escreva a tarefa grande.\n2. Divida em passos que levem menos de 5 minutos cada.\n3. Faça apenas o primeiro passo.\n4. Marque como feito e decida se continua.', 5, 'Fácil'),
  (4, 'Pausa com movimento', 'Levante, alongue o corpo e caminhe um pouco.',
   '1. Levante da cadeira.\n2. Estique os braços para cima e para os lados.\n3. Gire os ombros e o pescoço devagar.\n4. Caminhe um pouco pela casa e beba água.', 5, 'Fácil'),
  (4, 'Desligar telas', 'Fique 30 minutos sem celular antes de dormir.',
   '1. Coloque um alarme 30 minutos antes de dormir.\n2. Quando tocar, deixe o celular carregando longe da cama.\n3. Troque a tela por algo calmo: ler, ouvir música ou desenhar.', 30, 'Difícil');
