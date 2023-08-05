const readline = require('readline');

class Cliente {
    constructor(email, senha) {
        this.email = email;
        this.senha = senha;
        this.destinoEscolhido = null;
    }
}

class Destino {
    constructor(nome, preco, pais) {
        this.nome = nome;
        this.preco = preco;
        this.pais = pais;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let totalClientes = 0;
let totalDestinos = 0;
const administradorEmail = "bferreirafelipe@gmail.com";
const administradorSenha = "123456";
let logadoCliente = false;
let logadoAdministrador = false;
const clientes = [];
const destinos = [];

function validarSenha(senha) {
    return senha.length === 6 && !isNaN(senha);
}

function consultarClientes(clientes) {
    if (clientes.length > 0) {
        console.log("Lista de clientes:");
        clientes.forEach((cliente, index) => {
            console.log(`Cliente ${index + 1}:`);
            console.log(`Email: ${cliente.email}`);
            if (cliente.destinoEscolhido) {
                console.log(`Destino escolhido: ${cliente.destinoEscolhido.nome} (${cliente.destinoEscolhido.pais}) - Preço: R$ ${cliente.destinoEscolhido.preco}`);
            } else {
                console.log("Nenhum destino escolhido.");
            }
        });
    } else {
        console.log("Nenhum cliente cadastrado!");
    }
}

function consultarDestinos(destinos) {
    if (destinos.length > 0) {
        console.log("Lista de destinos:");
        destinos.forEach((destino, index) => {
            console.log(`Destino ${index + 1}:`);
            console.log(`Nome: ${destino.nome}`);
            console.log(`País: ${destino.pais}`);
            console.log(`Preço: R$ ${destino.preco}`);
        });
    } else {
        console.log("Nenhum destino cadastrado!");
    }
}

async function main() {
    while (true) {
        console.log("----------- MENU -----------");
        console.log("1. Login");
        console.log("2. Cadastro");
        console.log("3. Sair");
        const opcao = Number(await getInput("Escolha uma opção: "));

        switch (opcao) {
            case 1:
                if (logadoCliente || logadoAdministrador) {
                    console.log("Você já está logado no sistema!");
                } else {
                    const email = await getInput("Digite o email: ");
                    const senha = await getInput("Digite a senha: ");

                    if (email === administradorEmail && senha === administradorSenha) {
                        logadoAdministrador = true;
                        console.log("Login administrador realizado com sucesso!");
                    } else {
                        const clienteEncontrado = clientes.find(cliente => cliente.email === email && cliente.senha === senha);

                        if (clienteEncontrado) {
                            logadoCliente = true;
                            console.log("Login cliente realizado com sucesso!");
                        } else {
                            console.log("Email ou senha inválidos!");
                        }
                    }
                }
                break;

            case 2:
                if (logadoCliente || logadoAdministrador) {
                    console.log("Você já está logado no sistema! Faça logout antes de realizar um novo cadastro.");
                } else {
                    const emailCadastro = await getInput("Digite o email: ");
                    const senhaCadastro = await getInput("Digite a senha (deve conter 6 números): ");

                    if (validarSenha(senhaCadastro)) {
                        const novoCliente = new Cliente(emailCadastro, senhaCadastro);
                        clientes.push(novoCliente);
                        totalClientes++;
                        console.log("Cadastro realizado com sucesso!");
                    } else {
                        console.log("Senha inválida! A senha deve conter exatamente 6 números.");
                    }
                }
                break;

            case 3:
                console.log("Encerrando o programa...");
                process.exit(0);

            default:
                console.log("Opção inválida!");
        }

        if (logadoCliente) {
            while (true) {
                console.log("----------- MENU CLIENTE -----------");
                console.log("1. Escolher destino");
                console.log("2. Logout");
                const opcaoCliente = Number(await getInput("Escolha uma opção: "));

                switch (opcaoCliente) {
                    case 1:
                        if (totalDestinos > 0) {
                            console.log("Escolha uma opção:");
                            console.log("1. Destinos no Brasil");
                            console.log("2. Destinos internacionais");
                            const escolhaOpcao = Number(await getInput("Escolha a opção desejada: "));
                            if (escolhaOpcao === 1) {
                                const destinosBrasil = destinos.filter(destino => destino.pais === "Brasil");
                                console.log("Destinos no Brasil disponíveis:");
                                destinosBrasil.forEach((destino, index) => {
                                    console.log(`${index + 1}. ${destino.nome} - Preço: R$ ${destino.preco}`);
                                });
                                const escolhaDestino = Number(await getInput("Escolha o número do destino desejado: "));
                                if (escolhaDestino >= 1 && escolhaDestino <= destinosBrasil.length) {
                                    clientes[totalClientes - 1].destinoEscolhido = destinosBrasil[escolhaDestino - 1];
                                    console.log(`Você escolheu o destino ${destinosBrasil[escolhaDestino - 1].nome} - Preço: R$ ${destinosBrasil[escolhaDestino - 1].preco}`);
                                    console.log("Agora você está cadastrado para este destino!");
                                } else {
                                    console.log("Opção inválida!");
                                }
                            } else if (escolhaOpcao === 2) {
                                const destinosInternacionais = destinos.filter(destino => destino.pais !== "Brasil");
                                console.log("Destinos internacionais disponíveis:");
                                destinosInternacionais.forEach((destino, index) => {
                                    console.log(`${index + 1}. ${destino.nome} - País: ${destino.pais} - Preço: R$ ${destino.preco}`);
                                });
                                const escolhaDestino = Number(await getInput("Escolha o número do destino desejado: "));
                                if (escolhaDestino >= 1 && escolhaDestino <= destinosInternacionais.length) {
                                    clientes[totalClientes - 1].destinoEscolhido = destinosInternacionais[escolhaDestino - 1];
                                    console.log(`Você escolheu o destino ${destinosInternacionais[escolhaDestino - 1].nome} - País: ${destinosInternacionais[escolhaDestino - 1].pais} - Preço: R$ ${destinosInternacionais[escolhaDestino - 1].preco}`);
                                    console.log("Agora você está cadastrado para este destino!");
                                } else {
                                    console.log("Opção inválida!");
                                }
                            } else {
                                console.log("Opção inválida!");
                            }
                        } else {
                            console.log("Nenhum destino cadastrado!");
                        }
                        break;

                    case 2:
                        logadoCliente = false;
                        console.log("Logout realizado com sucesso!");
                        break;

                    default:
                        console.log("Opção inválida!");
                }

                if (opcaoCliente === 2) {
                    break;
                }
            }
        }

        if (logadoAdministrador) {
            while (true) {
                console.log("----------- MENU ADMINISTRADOR -----------");
                console.log("1. Consultar clientes");
                console.log("2. Consultar destinos");
                console.log("3. Adicionar destino");
                console.log("4. Logout");
                const opcaoAdmin = Number(await getInput("Escolha uma opção: "));

                switch (opcaoAdmin) {
                    case 1:
                        consultarClientes(clientes);
                        break;

                    case 2:
                        consultarDestinos(destinos);
                        break;

                    case 3:
                        const nomeDestino = await getInput("Digite o nome do destino: ");
                        const paisDestino = await getInput("Digite o país do destino: ");
                        const precoDestino = await getInput("Digite o preço do destino: ");
                        if (!isNaN(parseFloat(precoDestino))) {
                            destinos.push(new Destino(nomeDestino, parseFloat(precoDestino), paisDestino));
                            totalDestinos++;
                            console.log("Destino adicionado com sucesso!");
                        } else {
                            console.log("Preço inválido!");
                        }
                        break;

                    case 4:
                        logadoAdministrador = false;
                        console.log("Logout realizado com sucesso!");
                        break;

                    default:
                        console.log("Opção inválida!");
                }

                if (opcaoAdmin === 4) {
                    break;
                }
            }
        }
    }
}

function getInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

main();

