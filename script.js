const TEMA_ESCURO = 'dark';
const TEMA_CLARO = 'light';

const MAPA_ACENTOS = [
    { base: 'A', letras: /[ÀÁÂÃÄ]/g },
    { base: 'E', letras: /[ÈÉÊË]/g },
    { base: 'I', letras: /[ÌÍÎÏ]/g },
    { base: 'O', letras: /[ÒÓÔÕÖ]/g },
    { base: 'U', letras: /[ÙÚÛÜ]/g },
    { base: 'C', letras: /[Ç]/g },
    { base: 'N', letras: /[Ñ]/g },
    { base: 'a', letras: /[àáâãä]/g },
    { base: 'e', letras: /[èéêë]/g },
    { base: 'i', letras: /[ìíîï]/g },
    { base: 'o', letras: /[òóôõö]/g },
    { base: 'u', letras: /[ùúûü]/g },
    { base: 'c', letras: /[ç]/g },
    { base: 'n', letras: /[ñ]/g }
];

// ================================
// FUNÇÕES UTILITÁRIAS
// ================================

function removerAcentosECaracteresEspeciais(str) {
    if (!str) return '';
    
    return MAPA_ACENTOS.reduce((texto, acento) => 
        texto.replace(acento.letras, acento.base), str);
}

function obterValorCampo(id, uppercase = true) {
    const elemento = document.getElementById(id);
    if (!elemento) return '';

    let valor = elemento.value || '';

    const valorSemAcentos = removerAcentosECaracteresEspeciais(valor);

    return uppercase ? valorSemAcentos.toUpperCase() : valorSemAcentos;
}

function valorOuPadrao(valor, padrao = '') {
    return valor || padrao;
}

// ================================
// COLETA E PROCESSAMENTO DE DADOS
// ================================

function coletarDadosFormulario() {
    const dados = {
        origem_comercial: obterValorCampo('origem_comercial'),
        tipo_atendimento: obterValorCampo('tipo_atendimento'),
        cpf: obterValorCampo('cpf', false),
        data_nascimento: obterValorCampo('data_nascimento', false),
        nome_completo: obterValorCampo('nome_completo'),
        rg: obterValorCampo('rg'),
        email: obterValorCampo('email', false),
        cep: obterValorCampo('cep', false),
        endereco_completo: obterValorCampo('endereco_completo'),
        referencia_completa: obterValorCampo('referencia_completa'),
        bairro: obterValorCampo('bairro'),
        telefone_principal: obterValorCampo('telefone_principal', false),
        telefone_recado: obterValorCampo('telefone_recado', false),
        plano_escolhido: obterValorCampo('plano_escolhido'),
        vencimento_mensalidade: obterValorCampo('vencimento_mensalidade'),
        taxa_instalacao: obterValorCampo('taxa_instalacao'),
        forma_pagto: obterValorCampo('forma_pagto'),
        primeira_mensalidade: obterValorCampo('primeira_mensalidade'),
        acompanhante_nome: obterValorCampo('acompanhante_nome'),
        acompanhante_telefone: obterValorCampo('acompanhante_telefone', false),
        servico_adicional: obterValorCampo('servico_adicional'),
        observacoes: obterValorCampo('observacoes'),
        vendedora: obterValorCampo('vendedora')
    };
    return dados;
}

function gerarTextoFicha(dados) {
    let ficha = "*FICHA CADASTRAL CPF*\n\n";

    // Origem e Tipo de Atendimento
    ficha += `ORIGEM COMERCIAL: ${dados.origem_comercial}\n\n`;
    ficha += `TIPO DE ATENDIMENTO: ${dados.tipo_atendimento}\n\n`;

    // Dados pessoais
    ficha += `CPF: ${dados.cpf}\n`;
    ficha += `DATA DE NASCIMENTO: ${dados.data_nascimento}\n`;
    ficha += `NOME COMPLETO: ${dados.nome_completo}\n`;
    ficha += `RG: ${dados.rg}\n`;
    ficha += `EMAIL: ${dados.email}\n\n`;

    // Endereço
    ficha += `CEP: ${dados.cep}\n`;
    ficha += `ENDERECO COMPLETO ONDE DESEJA INSTALAR A INTERNET: ${dados.endereco_completo}\n`;
    ficha += `REFERENCIA COMPLETA (OBRIGATORIO): ${dados.referencia_completa}\n`;
    ficha += `BAIRRO: ${dados.bairro}\n\n`;

    // Telefones
    ficha += `TELEFONE PRINCIPAL: ${dados.telefone_principal}\n`;
    ficha += `TELEFONE PARA RECADO (OBRIGATORIO): ${dados.telefone_recado}\n\n`;

    // Plano e pagamento
    ficha += `PLANO ESCOLHIDO: ${dados.plano_escolhido}\n\n`;
    ficha += `VENCIMENTO DA MENSALIDADE: ${dados.vencimento_mensalidade}\n\n`;

    if (dados.taxa_instalacao) {
        ficha += `TAXA DE INSTALACAO E FORMA DE PAGAMENTO: ${dados.taxa_instalacao}\n\n`;
    }

    ficha += `FORMA DE PAGTO MENSALIDADE: ${dados.forma_pagto}\n\n`;

    // Primeira mensalidade
    if (dados.primeira_mensalidade) {
        ficha += `PRIMEIRA MENSALIDADE PROPORCIONAL AOS DIAS DE UTILIZACAO\n`;
        ficha += `${dados.primeira_mensalidade}\n\n`;
    }

    // Acompanhante
    if (dados.acompanhante_nome || dados.acompanhante_telefone) {
        ficha += `QUEM VAI ACOMPANHAR A INSTALACAO:\n`;
        if (dados.acompanhante_nome) {
            ficha += `NOME: ${dados.acompanhante_nome}\n`;
        }
        if (dados.acompanhante_telefone) {
            ficha += `TELEFONE 1: ${dados.acompanhante_telefone}\n`;
        }
        ficha += `\n`;
    }

    // Serviço adicional
    if (dados.servico_adicional) {
        ficha += `SERVICO ADICIONAL CASO POSSUA: ${dados.servico_adicional}\n`;
    }

    // Observações
    if (dados.observacoes) {
        ficha += `OBSERVACOES PARA ORDEM DE SERVICO: ${dados.observacoes}\n`;
    }

    // Vendedora
    if (dados.vendedora) {
        ficha += `VENDEDORA: ${dados.vendedora}\n`;
    }
    
    return ficha;
}

// ================================
// INTERFACE E INTERAÇÃO
// ================================

function exibirFicha(textoFicha) {
    const resultadoElement = document.getElementById('resultado');
    resultadoElement.textContent = textoFicha;
    resultadoElement.style.display = "block";
}

async function copiarParaAreaDeTransferencia(texto) {
    try {
        await navigator.clipboard.writeText(texto);
        return true;
    } catch (erro) {
        console.error('Erro ao copiar:', erro);
        return false;
    }
}

async function gerarFicha() {
    const dados = coletarDadosFormulario();
    const textoFicha = gerarTextoFicha(dados);
    
    exibirFicha(textoFicha);
    
    const sucessoCopia = await copiarParaAreaDeTransferencia(textoFicha);
    
    if (sucessoCopia) {
        showToast('Ficha copiada para a área de transferência!');
    } else {
        showToast('Erro ao copiar ficha!', true);
    }
}

function limparFormulario() {
    document.getElementById('cadastroForm').reset();
    const resultadoElement = document.getElementById('resultado');
    resultadoElement.textContent = '';
    resultadoElement.style.display = "none";
    
    showToast('Formulário limpo!');
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show' + (isError ? ' error' : '');
    
    setTimeout(() => {
        toast.classList.remove('show', 'error');
    }, 3000);
}

// ================================
// SISTEMA DE TEMA
// ================================

function configurarTema(modoClaro) {
    const logo = document.getElementById("logo");
    const themeLabel = document.getElementById("themeLabel");
    
    if (modoClaro) {
        document.body.classList.add("light-mode");
        themeLabel.textContent = "Light Mode";
        logo.src = "assets/light-logo.png";
        localStorage.setItem("theme", TEMA_CLARO);
    } else {
        document.body.classList.remove("light-mode");
        themeLabel.textContent = "Dark Mode";
        logo.src = "assets/dark-logo.png";
        localStorage.setItem("theme", TEMA_ESCURO);
    }
}

function inicializarApp() {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme") || TEMA_ESCURO;
    
    configurarTema(savedTheme === TEMA_CLARO);
    themeToggle.checked = savedTheme === TEMA_CLARO;
    
    themeToggle.addEventListener("change", function() {
        configurarTema(themeToggle.checked);
    });
}

// ================================
// FORMATAÇÃO AUTOMÁTICA DE CAMPOS
// ================================

function configurarFormatacaoAutomatica() {
    // CPF - apenas números, máximo 11 dígitos
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                e.target.value = value;
            }
        });
    }

    // CEP - apenas números, máximo 8 dígitos
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                e.target.value = value;
            }
        });
    }

    // Data de Nascimento - autocomplete com / (dd/mm/aaaa)
    const dataInput = document.getElementById('data_nascimento');
    if (dataInput) {
        dataInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número

            // Adiciona as barras automaticamente
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            if (value.length >= 5) {
                value = value.substring(0, 5) + '/' + value.substring(5);
            }

            // Limita ao tamanho máximo (dd/mm/aaaa = 10 caracteres)
            if (value.length > 10) {
                value = value.substring(0, 10);
            }

            e.target.value = value;
        });

        // Adiciona validação ao sair do campo
        dataInput.addEventListener('blur', function(e) {
            const value = e.target.value;
            if (value && value.length === 10) {
                const partes = value.split('/');
                const dia = parseInt(partes[0]);
                const mes = parseInt(partes[1]);
                const ano = parseInt(partes[2]);

                // Validação básica
                if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900 || ano > new Date().getFullYear()) {
                    showToast('Data de nascimento inválida!', true);
                    e.target.value = '';
                }
            }
        });
    }

    // Telefones - apenas números, máximo 11 dígitos
    const telefoneIds = ['telefone_principal', 'telefone_recado', 'acompanhante_telefone'];
    telefoneIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    e.target.value = value;
                }
            });
        }
    });
}

// ================================
// INICIALIZAÇÃO
// ================================

document.addEventListener('DOMContentLoaded', function() {
    configurarFormatacaoAutomatica();
    inicializarApp();
});