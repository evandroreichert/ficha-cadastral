const TEMA_ESCURO = 'dark';
const TEMA_CLARO = 'light';

const TIPO_FICHA_CPF = 'cpf';
const TIPO_FICHA_CNPJ = 'cnpj';

let tipoFichaAtual = TIPO_FICHA_CPF;

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

function coletarDadosComuns() {
    return {
        origem_comercial: obterValorCampo('origem_comercial'),
        tipo_atendimento: obterValorCampo('tipo_atendimento'),
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
}

function coletarDadosFormularioCPF() {
    return {
        ...coletarDadosComuns(),
        cpf: obterValorCampo('cpf', false),
        data_nascimento: obterValorCampo('data_nascimento', false),
        nome_completo: obterValorCampo('nome_completo'),
        rg: obterValorCampo('rg'),
        email: obterValorCampo('email', false)
    };
}

function coletarDadosFormularioCNPJ() {
    return {
        ...coletarDadosComuns(),
        cnpj: obterValorCampo('cnpj', false),
        nome_social: obterValorCampo('nome_social'),
        email: obterValorCampo('email_cnpj', false),
        ie: obterValorCampo('ie'),
        signatario_cpf: obterValorCampo('signatario_cpf', false),
        signatario_nome: obterValorCampo('signatario_nome'),
        signatario_data_nascimento: obterValorCampo('signatario_data_nascimento', false)
    };
}

function gerarBlocoEnderecoTelefones(dados) {
    let texto = '';
    texto += `CEP: ${dados.cep}\n`;
    texto += `ENDERECO COMPLETO ONDE DESEJA INSTALAR A INTERNET: ${dados.endereco_completo}\n`;
    texto += `REFERENCIA COMPLETA (OBRIGATORIO): ${dados.referencia_completa}\n`;
    texto += `BAIRRO: ${dados.bairro}\n\n`;
    texto += `TELEFONE PRINCIPAL: ${dados.telefone_principal}\n`;
    texto += `TELEFONE PARA RECADO (OBRIGATORIO): ${dados.telefone_recado}\n\n`;
    return texto;
}

function gerarBlocoPlanoPagamento(dados) {
    let texto = '';
    texto += `PLANO ESCOLHIDO: ${dados.plano_escolhido}\n\n`;
    texto += `VENCIMENTO DA MENSALIDADE: ${dados.vencimento_mensalidade}\n\n`;

    if (dados.taxa_instalacao) {
        texto += `TAXA DE INSTALACAO E FORMA DE PAGAMENTO: ${dados.taxa_instalacao}\n\n`;
    }

    texto += `FORMA DE PAGTO MENSALIDADE: ${dados.forma_pagto}\n\n`;

    if (dados.primeira_mensalidade) {
        texto += `PRIMEIRA MENSALIDADE PROPORCIONAL AOS DIAS DE UTILIZACAO\n`;
        texto += `${dados.primeira_mensalidade}\n\n`;
    }

    return texto;
}

function gerarBlocoAdicionais(dados) {
    let texto = '';

    if (dados.acompanhante_nome || dados.acompanhante_telefone) {
        texto += `QUEM VAI ACOMPANHAR A INSTALACAO:\n`;
        if (dados.acompanhante_nome) {
            texto += `NOME: ${dados.acompanhante_nome}\n`;
        }
        if (dados.acompanhante_telefone) {
            texto += `TELEFONE 1: ${dados.acompanhante_telefone}\n`;
        }
        texto += `\n`;
    }

    if (dados.servico_adicional) {
        texto += `SERVICO ADICIONAL CASO POSSUA: ${dados.servico_adicional}\n`;
    }

    if (dados.observacoes) {
        texto += `OBSERVACOES PARA ORDEM DE SERVICO: ${dados.observacoes}\n`;
    }

    if (dados.vendedora) {
        texto += `VENDEDORA: ${dados.vendedora}\n`;
    }

    return texto;
}

function gerarTextoFichaCPF(dados) {
    let ficha = "*FICHA CADASTRAL CPF*\n\n";

    ficha += `ORIGEM COMERCIAL: ${dados.origem_comercial}\n\n`;
    ficha += `TIPO DE ATENDIMENTO: ${dados.tipo_atendimento}\n\n`;

    ficha += `CPF: ${dados.cpf}\n`;
    ficha += `DATA DE NASCIMENTO: ${dados.data_nascimento}\n`;
    ficha += `NOME COMPLETO: ${dados.nome_completo}\n`;
    ficha += `RG: ${dados.rg}\n`;
    ficha += `EMAIL: ${dados.email}\n\n`;

    ficha += gerarBlocoEnderecoTelefones(dados);
    ficha += gerarBlocoPlanoPagamento(dados);
    ficha += gerarBlocoAdicionais(dados);

    return ficha;
}

function gerarTextoFichaCNPJ(dados) {
    let ficha = "*FICHA CADASTRAL CNPJ*\n\n";

    ficha += `TIPO DE ATENDIMENTO: ${dados.tipo_atendimento}\n\n`;
    ficha += `ORIGEM COMERCIAL: ${dados.origem_comercial}\n\n`;

    ficha += `CNPJ: ${dados.cnpj}\n`;
    ficha += `NOME SOCIAL: ${dados.nome_social}\n`;
    ficha += `EMAIL: ${dados.email}\n`;
    ficha += `IE: ${dados.ie}\n\n`;

    ficha += gerarBlocoEnderecoTelefones(dados);

    ficha += `DADOS DE QUEM ASSINA PELA EMPRESA (OBRIGATORIO):\n`;
    ficha += `CPF: ${dados.signatario_cpf}\n`;
    ficha += `NOME: ${dados.signatario_nome}\n`;
    ficha += `DATA DE NASCIMENTO: ${dados.signatario_data_nascimento}\n\n`;

    ficha += gerarBlocoPlanoPagamento(dados);
    ficha += gerarBlocoAdicionais(dados);

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
    let dados;
    let textoFicha;

    if (tipoFichaAtual === TIPO_FICHA_CNPJ) {
        dados = coletarDadosFormularioCNPJ();
        textoFicha = gerarTextoFichaCNPJ(dados);
    } else {
        dados = coletarDadosFormularioCPF();
        textoFicha = gerarTextoFichaCPF(dados);
    }

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
// ALTERNÂNCIA ENTRE CPF E CNPJ
// ================================

function alternarTipoFicha(novoTipo) {
    tipoFichaAtual = novoTipo;

    const titulo = document.getElementById('formTitulo');
    if (titulo) {
        titulo.textContent = novoTipo === TIPO_FICHA_CNPJ
            ? 'Ficha Cadastral CNPJ'
            : 'Ficha Cadastral CPF';
    }

    document.querySelectorAll('.tipo-ficha-btn').forEach(btn => {
        const ativo = btn.dataset.tipo === novoTipo;
        btn.classList.toggle('active', ativo);
        btn.setAttribute('aria-selected', ativo ? 'true' : 'false');
    });

    document.querySelectorAll('.form-section[data-tipo]').forEach(secao => {
        const visivel = secao.dataset.tipo === novoTipo;
        secao.style.display = visivel ? '' : 'none';

        secao.querySelectorAll('input, select, textarea').forEach(campo => {
            if (visivel) {
                if (campo.dataset.originalRequired === 'true') {
                    campo.setAttribute('required', '');
                }
            } else {
                if (campo.hasAttribute('required')) {
                    campo.dataset.originalRequired = 'true';
                    campo.removeAttribute('required');
                }
            }
        });
    });
}

function inicializarSeletorTipoFicha() {
    document.querySelectorAll('.form-section[data-tipo] input[required], .form-section[data-tipo] select[required], .form-section[data-tipo] textarea[required]').forEach(campo => {
        campo.dataset.originalRequired = 'true';
    });

    document.querySelectorAll('.tipo-ficha-btn').forEach(btn => {
        btn.addEventListener('click', () => alternarTipoFicha(btn.dataset.tipo));
    });

    document.querySelectorAll('.form-section[data-tipo="cnpj"]').forEach(secao => {
        secao.querySelectorAll('input, select, textarea').forEach(campo => {
            if (campo.hasAttribute('required')) {
                campo.dataset.originalRequired = 'true';
                campo.removeAttribute('required');
            }
        });
    });

    document.querySelectorAll('.form-section[data-tipo="cnpj"] label .required').forEach(span => {
        const input = span.closest('.form-group')?.querySelector('input, select, textarea');
        if (input) {
            input.dataset.originalRequired = 'true';
        }
    });
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

function aplicarFormatoNumerico(id, maxDigitos) {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= maxDigitos) {
            e.target.value = value;
        } else {
            e.target.value = value.substring(0, maxDigitos);
        }
    });
}

function aplicarFormatoData(id) {
    const dataInput = document.getElementById(id);
    if (!dataInput) return;

    dataInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length >= 5) {
            value = value.substring(0, 5) + '/' + value.substring(5);
        }

        if (value.length > 10) {
            value = value.substring(0, 10);
        }

        e.target.value = value;
    });

    dataInput.addEventListener('blur', function(e) {
        const value = e.target.value;
        if (value && value.length === 10) {
            const partes = value.split('/');
            const dia = parseInt(partes[0]);
            const mes = parseInt(partes[1]);
            const ano = parseInt(partes[2]);

            if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900 || ano > new Date().getFullYear()) {
                showToast('Data de nascimento inválida!', true);
                e.target.value = '';
            }
        }
    });
}

function configurarFormatacaoAutomatica() {
    aplicarFormatoNumerico('cpf', 11);
    aplicarFormatoNumerico('cnpj', 14);
    aplicarFormatoNumerico('signatario_cpf', 11);
    aplicarFormatoNumerico('cep', 8);

    aplicarFormatoData('data_nascimento');
    aplicarFormatoData('signatario_data_nascimento');

    const telefoneIds = ['telefone_principal', 'telefone_recado', 'acompanhante_telefone'];
    telefoneIds.forEach(id => aplicarFormatoNumerico(id, 11));
}

// ================================
// INICIALIZAÇÃO
// ================================

document.addEventListener('DOMContentLoaded', function() {
    configurarFormatacaoAutomatica();
    inicializarSeletorTipoFicha();
    inicializarApp();
});
