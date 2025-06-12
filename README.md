# TakeOff-2025.1-Squad12

Repositório de desenvolvimento do Squad 12 para
a disciplina de Residência em Software III.

## Execução

### Pré-requisitos

- Possuir o Docker e o Node.js instalado.

### Etapas

1. Clone o projeto:

    ```sh
    git clone https://github.com/RichardSouzza/TakeOff-2025.1-Squad12
    ```

2. Acesse a pasta do frontend:

    ```sh
    cd TakeOff-2025.1-Squad12/src/frontend
    ```

3. Defina as variáveis de ambiente:

    ```sh
    echo 'NEXT_PUBLIC_API_URL = "https://takeoff-2025-1-squad12.onrender.com/api' > .env
    ```

4. Instale as dependências:

    ```sh
    npm ci
    ```

5. Execute o frontend:

    ```sh
    npm run dev
    ```

6. Acesse a [link](http://localhost:3000).
