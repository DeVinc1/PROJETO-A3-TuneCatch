<h1 align="center"> <img src="./readme_assets/Logo - Red&White.png" width="40" style="border-radius: 10px;"git> TuneCatch </h1> 
<p align="center"> <em>Uma plataforma para a criação, compartilhamento e descoberta de playlists musicais de forma inteligente e contextual.</em> </p>
<p align="center">
  <img src="https://github.com/DeVinc1/PROJETO-A3-TuneCatch/blob/main/readme_assets/TuneCatch-ui.png?raw=true" alt="Demonstração da Interface do TuneCatch" width="80%">
</p>
<hr>

## 📖 Sumário

- [📋 Sobre o Projeto](#-sobre-o-projeto)
-  [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
- [✨ Funcionalidades](#-funcionalidades)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Endpoints da API](#-endpoints-da-api)
- [👨‍💻 Autores](#-autores)
- [❤️ Agradecimentos](#%EF%B8%8F-agradecimentos)

<hr>


## 📖 Sobre o Projeto

O **TuneCatch** é uma plataforma social desenvolvida para transformar a maneira como criamos, compartilhamos e descobrimos música. A interface, construída com **React**, oferece uma experiência interativa e moderna, enquanto toda a lógica de negócio é operada por uma robusta arquitetura de microsserviços de API em **Node.js**.

### O Diferencial: Descoberta Contextual por Tags

O coração do TuneCatch é seu mecanismo de busca e criação baseado em tags. Ao criar uma playlist, o usuário pode associá-la a múltiplas tags descritivas, organizadas em quatro dimensões principais:

* **🎵 Gênero & Artista:**
    * *Exemplos: Taylor Swift, The Weeknd, Pop, Indie, Rock Anos 80.*
* **✨ *Mood* (Vibe):**
    * *Exemplos: Nostalgia, Animação, Foco, Triste, Festa.*
* **🗓️ Época:**
    * *Exemplos: Anos 80, Anos 90, Início dos anos 2000, Atualidades.*
* **🎉 Ocasião:**
    * *Exemplos: Viagem de carro, Noites frias, Tardes de estudos, Malhar.*

Toda essa estrutura flexível de dados — usuários, playlists, tags e músicas — é persistida e gerenciada com eficiência por um banco de dados **PostgreSQL**.

### Busca Poderosa e Interação Social

Essa arquitetura permite uma descoberta de conteúdo extremamente refinada. Os microsserviços traduzem as buscas dos usuários em consultas complexas, permitindo encontrar playlists por:

-   **Combinação de Tags** (ex: playlists de `rock` dos `anos 90` para `viagem de carro`).
-   **Nome da Playlist** (ex: "*when life feels like a movie*").
-   **Nome de Usuário** (ex: `@user.name`).
-   **Músicas Específicas** (ex: todas as playlists que contêm "Feels Like" da Gracie Abrams).

Além da busca, a plataforma promove a interação social. Ações como seguir usuários e curtir playlists são processadas em tempo real, alimentando rankings dinâmicos e organizando os perfis de cada usuário.

Para completar a experiência, o **TuneCatch** se integra diretamente à **API do Spotify**, permitindo que os usuários ouçam as músicas das playlists descobertas diretamente na plataforma, através de um player de música integrado.

---
## 🛠️ Tech Stack

As seguintes ferramentas e tecnologias foram utilizadas na construção do TuneCatch:

#### Frontend
<p align="center">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=CSS&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
  <img src="https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React Native">
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router">
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</p>

#### Backend
<p align="center">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js">
      <img src="https://img.shields.io/badge/spotify API-%1db954.svg?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify">
            <img src="https://img.shields.io/badge/POSTMAN-%23F24E1E.svg?style=for-the-badge&logo=postman&logoColor=white" alt="Postman">
</p>


#### Banco de Dados
<p align="center">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

#### Ferramentas & Design
<p align="center">
  <img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM">
  <img src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" alt="Git">
  <img src="https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white" alt="Figma">
</p>

---

## ✨ Funcionalidades

O TuneCatch oferece uma rica gama de funcionalidades para a criação, compartilhamento e descoberta de playlists musicais:

### 🎶 Criação e Gerenciamento de Playlists
- **Criar Playlists:** Usuários podem criar novas playlists, adicionando um título e uma descrição.
- **Editar Playlists:** Modificar o nome, a descrição e adicionar/remover músicas de playlists existentes.
- **Excluir Playlists:** Remover playlists criadas pelo próprio usuário.

### 🏷️ Sistema de Tags Contextuais
- **Atribuir Tags:** Associar playlists a tags descritivas em quatro dimensões:
    - **Gênero & Artista:** Selecionar gêneros musicais e artistas relevantes.
    - **Mood (Clima):** Definir o "sentimento" da playlist (ex: animada, relaxante).
    - **Época:** Indicar o período temporal das músicas (ex: anos 80, atual).
    - **Ocasião:** Especificar o contexto ideal para ouvir a playlist (ex: estudo, festa).

### 🔎 Descoberta e Busca Inteligente
- **Busca por Combinação de Tags:** Encontrar playlists que correspondam a uma ou mais tags selecionadas em diferentes dimensões.
- **Busca por Nome de Playlist:** Pesquisar playlists pelo título.
- **Busca por Música:** Descobrir playlists que incluem uma música específica.
- **Busca por Usuário:** Explorar as playlists públicas de um determinado usuário (`@nomedeusuario`).

### 📱 Interação Social
- **Seguir Usuários:** Acompanhar outros criadores de playlist para ver suas novas adições.
- **Curtir Playlists:** Salvar playlists interessantes na sua lista de favoritas.
- **Rankings Dinâmicos:** (Em desenvolvimento) Visualizar as playlists mais curtidas e os usuários mais seguidos na plataforma.

### 👤 Perfil e Experiência do Usuário
- **Autenticação de Usuários:** Criar uma conta e fazer login para acessar a plataforma.
- **Página de Perfil:** Exibir as playlists criadas, as playlists curtidas e os usuários que segue e o seguem.
- **Player de Música Integrado:** Reproduzir as músicas das playlists diretamente no TuneCatch através da integração com a API do Spotify.

---

## 📂 Estrutura do Projeto

O projeto é organizado em uma arquitetura de monorepo, contendo quatro pastas principais: 

```
tunecatch/               
│
|
├── 📁 docs/
|			
├── 📁 backend/         
│   ├── 📁 node_modules/  
│   ├── 📁 src/           
│   │   ├── 📁 api/        
│   │   │   ├── 📁 controllers/ 
│   │   │   ├── 📁 models/      
│   │   │   ├── 📁 repositories/ 
│   │   │   ├── 📁 routes/      
│   │   │   ├── 📁 services/    
│   │   │   └── 📁 spotify-integration/ 
│   │   ├── 📁 config/   
│   │   └── 📁 utils/     
│   ├── .env              
│   ├── app-badge.js      
│   ├── app-playlist.js  
│   ├── app-tag.js        
│   ├── app-track.js      
│   ├── app-user.js       
│   ├── ecosystem.config.js # Arquivo de configuração para o gerenciador de processos PM2 
│   ├── .gitignore        
│   ├── package-lock.json  
│   └── package.json      
│
├── 📁 frontend/         
│   ├── 📁 node_modules/  
│   ├── 📁 public/        
│   ├── 📁 src/          
│   │   ├── 📁 assets/     
│   │   ├── 📁 components/ 
│   │   ├── 📁 contexts/   
│   │   ├── 📁 hooks/      
│   │   ├── 📁 layouts/    
│   │   ├── 📁 pages/      
│   │   ├── 📁 routes/     
│   │   ├── 📁 services/   
│   │   ├── App.css       
│   │   ├── App.jsx       
│   │   ├── config.js     
│   │   ├── index.css     
│   │   └── main.jsx     
│   ├── .env             
│   ├── .gitignore        
│   ├── eslint.config.js 
│   ├── index.html        
│   ├── package-lock.json 
│   ├── package.json      
│   ├── postcss.config.js 
│   ├── tailwind.config.js.
│   └── vite.config.js    
│
├── 📁 readme_assets/    
```
---

## 🚀 Endpoints da API

A API do TuneCatch serve como ponte entre a interface do usuário (frontend) e a camada de dados (banco de dados), processando requisições e garantindo a integridade das informações. A arquitetura segue princípios RPC e RESTful, com uma separação clara de responsabilidades por meio de verbos HTTP e rotas semânticas.

Os endpoints estão segmentados por microsserviços, de acordo com o recurso que manipulam.

A documentação mais detalhada pode ser encontrada em [TuneCatch - #6 - API](https://github.com/DeVinc1/PROJETO-A3-TuneCatch/blob/main/docs/TuneCatch%20-%20#6%20-%20Endpoints%20da%20API.pdf)

### Microsserviço de Usuários (/maestro/usuario)

Este serviço lida com todas as operações relacionadas a perfis de utilizador, autenticação, seguidores e banimento.

| Tipo | Objetivo | Verbo HTTP | Endpoint |
| :--- | :--- | :--- | :--- |
| RESTful | Cadastrar um novo usuário no sistema. | `POST` | `/maestro/usuario` |
| RPC-Style | Autenticar um usuário e obter acesso. | `POST` | `/maestro/usuario/fazer-login` |
| RESTful | Retornar os dados completos de um usuário pelo seu ID. | `GET` | `/maestro/usuario/{id}` |
| RESTful | Obter os detalhes de um usuário pelo seu nome de usuário. | `GET` | `/maestro/usuario/nome-usuario/{username}` |
| RESTful | Obter todos os usuários do sistema. | `GET` | `/maestro/usuario/` |
| RESTful | Buscar usuários por nome de exibição. | `GET` | `/maestro/usuario/nome-exibicao?q={query}` |
| RESTful | Atualizar os detalhes do perfil de um usuário. | `PUT` | `/maestro/usuario/{id}/detalhes` |
| RPC-Style | Atualizar a senha de um usuário. | `PUT` | `/maestro/usuario/{id}/senha` |
| RPC-Style | Adicionar ou remover um usuário da lista de "seguindo" (toggle). | `POST` | `/maestro/usuario/seguir/{id_usuario}` |
| RPC-Style | Banir um usuário do sistema (requer privilégios de administrador). | `POST` | `/maestro/usuario/banir-perfil/{id_usuario}` |
| RESTful | Excluir permanentemente um perfil de usuário. | `DELETE` | `/maestro/usuario/{id_usuario}` |

### Microsserviço de Playlists (/maestro/playlist)

Este serviço lida com a criação, gestão e interação com as playlists do sistema.

| Tipo | Objetivo | Verbo HTTP | Endpoint |
| :--- | :--- | :--- | :--- |
| RESTful | Criar uma nova playlist para um usuário. | `POST` | `/maestro/playlist/{id_usuario}` |
| RESTful | Atualizar os detalhes de uma playlist existente. | `PUT` | `/maestro/playlist/{id_playlist}` |
| RESTful | Excluir uma playlist existente. | `DELETE` | `/maestro/playlist/{id_playlist}` |
| RESTful | Buscar todas as playlists do sistema. | `GET` | `/maestro/playlist` |
| RESTful | Buscar uma playlist específica pelo seu ID. | `GET` | `/maestro/playlist/{id_playlist}` |
| RESTful | Buscar playlists públicas por nome (busca parcial). | `GET` | `/maestro/playlist/publica/{nome}` |
| RESTful | Buscar todas as playlists (públicas e privadas) criadas por um usuário. | `GET` | `/maestro/playlist/usuario/{id_usuario}` |
| RESTful | Buscar apenas as playlists públicas criadas por um usuário. | `GET` | `/maestro/playlist/usuario-publicas/{id_usuario}` |
| RPC-Style | Adicionar ou remover um "like" de um usuário em uma playlist. | `POST` | `/maestro/playlist/curtir/{id_usuario}` |
| RPC-Style | Alterar a visibilidade de uma curtida no perfil do usuário. | `POST` | `/maestro/playlist/curtir/alterar-visibilidade/{id_usuario}` |
| RESTful | Buscar todas as playlists que um usuário curtiu. | `GET` | `/maestro/playlist/curtidas/{id_usuario}` |
| RESTful | Buscar apenas as playlists curtidas por um usuário que ele marcou como visíveis. | `GET` | `/maestro/playlist/curtidas-publicas/{id_usuario}` |

### Microsserviço de Badges (/maestro/badges)

Este serviço lida com a criação, gestão e atribuição de conquistas (badges) no sistema.

| Tipo | Objetivo | Verbo HTTP | Endpoint |
| :--- | :--- | :--- | :--- |
| RESTful | Criar uma nova badge no sistema. | `POST` | `/maestro/badges` |
| RESTful | Retornar todas as badges cadastradas no sistema. | `GET` | `/maestro/badges` |
| RESTful | Buscar uma badge específica pelo seu ID. | `GET` | `/maestro/badges/{id}` |
| RESTful | Buscar uma badge específica pelo seu nome. | `GET` | `/maestro/badges/nome/{name}` |
| RESTful | Atualizar os detalhes de uma badge existente. | `PUT` | `/maestro/badges/{id}` |
| RESTful | Excluir uma badge do sistema. | `DELETE` | `/maestro/badges/{id}` |
| RPC-Style | Atribuir uma badge a um usuário. | `POST` | `/maestro/badges/conceder/{id_usuario}` |
| RPC-Style | Alterar a visibilidade de uma badge que um usuário possui. | `POST` | `/maestro/badges/alterar-visibilidade/{id_usuario}` |
| RESTful | Buscar todas as badges que um usuário possui. | `GET` | `/maestro/badges/usuario/{id_usuario}` |

### Microsserviço de Tags (/maestro/tag)

Este serviço lida com a criação e gestão de tags, e a sua associação com playlists.

| Tipo | Objetivo | Verbo HTTP | Endpoint |
| :--- | :--- | :--- | :--- |
| RESTful | Criar uma nova tag no sistema. | `POST` | `/maestro/tag` |
| RESTful | Buscar todas as tags do sistema. | `GET` | `/maestro/tag` |
| RESTful | Buscar uma tag específica pelo seu ID. | `GET` | `/maestro/tag/{id}` |
| RESTful | Buscar tags por nome (busca parcial e case-insensitive). | `GET` | `/maestro/tag/nome/{name}` |
| RESTful | Atualizar os detalhes de uma tag existente. | `PUT` | `/maestro/tag/{id}` |
| RESTful | Excluir uma tag do sistema. | `DELETE` | `/maestro/tag/{id}` |
| RPC-Style | Adicionar ou remover uma tag de uma playlist (toggle). | `POST` | `/maestro/tag/adicionar/{id_playlist}` |
| RESTful | Buscar playlists que contenham uma ou mais tags específicas. | `GET` | `/maestro/tag/playlists-marcadas?q={tags}` |
| RESTful | Buscar todas as tags associadas a uma playlist específica. | `GET` | `/maestro/tag/playlists-tags/{id_playlist}` |

### Microsserviço de Músicas (/maestro/track)

Este serviço lida com a busca de músicas no Spotify e a sua gestão nas playlists.

| Tipo | Objetivo | Verbo HTTP | Endpoint |
| :--- | :--- | :--- | :--- |
| RESTful | Retornar uma lista de músicas do Spotify com base num termo de pesquisa. | `GET` | `/maestro/track/pesquisa/{nome}` |
| RESTful | Obter playlists que contêm uma música com o nome específico. | `GET` | `/maestro/track/playlists-com-musica/{nome_musica}` |
| RPC-Style | Adicionar uma música do Spotify a uma playlist. | `POST` | `/maestro/track/adicionar/{id_track}` |
| RESTful | Obter a lista de músicas de uma playlist específica, ordenadas pela posição. | `GET` | `/maestro/track/playlist-musicas/{id_playlist}` |
| RESTful | Remover uma música de uma playlist. | `DELETE` | `/maestro/track/{id_playlist}/{id_musica}` |

---

## 👨‍💻 Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/DeVinc1">
        <img src="https://github.com/DeVinc1.png" width="100px;" alt="Foto do Marcos Vinícius no GitHub"/><br>
        <sub>
          <b>Marcos Vinícius</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/XDods14">
        <img src="https://github.com/XDods14.png" width="100px;" alt="Foto do Dominic Nascimento no GitHub"/><br>
        <sub>
          <b>Dominic Nascimento</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/alIthestars">
        <img src="https://github.com/alIthestars.png" width="100px;" alt="Foto da Leticia Cristiny no GitHub"/><br>
        <sub>
          <b>Leticia Cristiny</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/The-Albatrosx">
        <img src="https://github.com/The-Albatrosx.png" width="100px;" alt="Foto da Isabellas Cristine no GitHub"/><br>
        <sub>
          <b>Isabella Cristine</b>
        </sub>
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/Malog792">
        <img src="https://github.com/Malog792.png" width="100px;" alt="Foto do Mauricio Lourenço no GitHub"/><br>
        <sub>
          <b>Mauricio Lourenço</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

---
## ❤️ Agradecimentos

Gostaríamos de expressar nossa especial gratidão ao nosso amigo **[Lucas Teixeira](https://github.com/LucassTeixeiraN)** pelo seu valioso apoio. Os recursos de pesquisa fornecidos por ele foram fundamentais e de grande ajuda durante as fases de concepção e desenvolvimento do TuneCatch.


---
