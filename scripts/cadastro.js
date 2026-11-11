/*
 * INK AGENDA - página de cadastro
 * Perfil (cliente ou tatuador), lista de requisitos da senha em tempo real, mostrar/ocultar senha,
 * máscara de telefone e validação com mensagens nos campos.
 */
(function () {
    'use strict';

    var V = window.InkValidacao;
    var UI = window.InkUI;

    var form = document.getElementById('form-cadastro');
    var aviso = document.getElementById('aviso-demo');
    var camposTatuador = form.querySelectorAll('[data-somente="tatuador"]');
    var campoEstudio = document.getElementById('estudio');
    var campoSenha = document.getElementById('senha');
    var campoTelefone = document.getElementById('telefone');
    var campoData = document.getElementById('data-nascimento');

    // Sem isto o navegador mostraria os balões dele; as mensagens ficam sob cada campo.
    form.noValidate = true;

    /* ---------- Perfil: cliente ou tatuador ---------- */

    // Campos escondidos ficam desabilitados, para não serem validados nem enviados.
    function aplicarTipo(tipo) {
        var ehTatuador = tipo === 'tatuador';
        camposTatuador.forEach(function (campo) {
            campo.hidden = !ehTatuador;
            campo.querySelectorAll('input').forEach(function (input) {
                input.disabled = !ehTatuador;
                if (!ehTatuador) { UI.limparErro(input); }
            });
        });
        campoEstudio.required = ehTatuador;
    }

    function tipoSelecionado() {
        return form.querySelector('input[name="tipo"]:checked').value;
    }

    // O login leva para cadastro.html?tipo=tatuador ou ?tipo=cliente
    var tipoDaUrl = new URLSearchParams(window.location.search).get('tipo');
    if (tipoDaUrl === 'tatuador' || tipoDaUrl === 'cliente') {
        form.querySelector('input[name="tipo"][value="' + tipoDaUrl + '"]').checked = true;
    }
    form.querySelectorAll('input[name="tipo"]').forEach(function (radio) {
        radio.addEventListener('change', function () { aplicarTipo(tipoSelecionado()); });
    });
    aplicarTipo(tipoSelecionado());

    /* ---------- Senha: requisitos em tempo real e mostrar/ocultar ---------- */

    var itensRequisitos = document.querySelectorAll('#requisitos-senha [data-regra]');

    function atualizarRequisitos() {
        var situacao = V.requisitosSenha(campoSenha.value);
        itensRequisitos.forEach(function (item) {
            var atendido = situacao[item.getAttribute('data-regra')];
            item.classList.toggle('atendido', atendido);
            item.querySelector('.estado').textContent = atendido ? ' (atendido)' : ' (pendente)';
        });
    }
    campoSenha.addEventListener('input', atualizarRequisitos);
    atualizarRequisitos();

    UI.ligarMostrarSenha(document.getElementById('mostrar-senha'), campoSenha);

    /* ---------- Telefone e data ---------- */

    campoTelefone.addEventListener('input', function () {
        campoTelefone.value = V.mascararTelefone(campoTelefone.value);
    });

    campoData.max = V.hojeISO(new Date());

    /* ---------- Validação ---------- */

    // Cada regra devolve '' (campo certo) ou a mensagem de erro.
    var regras = {
        nome: function (valor) {
            return valor.trim().length >= 2 ? '' : 'Informe seu nome completo.';
        },
        estudio: function (valor) {
            return valor.trim() ? '' : 'Informe o estúdio em que você tatua.';
        },
        email: function (valor) {
            if (!valor.trim()) { return 'Informe seu e-mail.'; }
            return V.emailValido(valor) ? '' : 'Informe um e-mail válido, como voce@exemplo.com.';
        },
        senha: function (valor) {
            return V.senhaValida(valor) ? '' : 'A senha ainda não atende a todos os requisitos.';
        },
        'data-nascimento': function (valor) {
            return V.erroDaData(valor, new Date());
        },
        telefone: function (valor) {
            return V.telefoneValido(valor) ? '' : 'Informe o telefone com DDD, por exemplo (11) 91234-5678.';
        }
    };

    // Valida um campo e mostra ou limpa o erro. Devolve true se estiver certo.
    function validarCampo(input) {
        var regra = regras[input.id];
        if (!regra || input.disabled) { return true; }
        var mensagem = regra(input.value);
        if (mensagem) { UI.mostrarErro(input, mensagem); } else { UI.limparErro(input); }
        return !mensagem;
    }

    var camposValidados = Object.keys(regras).map(function (id) { return document.getElementById(id); });

    camposValidados.forEach(function (input) {
        // Valida ao sair do campo; depois de um erro, acompanha a digitação.
        input.addEventListener('blur', function () { validarCampo(input); });
        input.addEventListener('input', function () {
            if (input.getAttribute('aria-invalid') === 'true') { validarCampo(input); }
        });
    });

    /* ---------- Envio ---------- */

    // Não há servidor: o formulário nunca é enviado, para que nenhum dado (principalmente a senha)
    // vá parar na barra de endereço ou em algum lugar sem querer.
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        aviso.hidden = true;

        var primeiroComErro = null;
        camposValidados.forEach(function (input) {
            if (!validarCampo(input) && !primeiroComErro) { primeiroComErro = input; }
        });
        if (primeiroComErro) {
            primeiroComErro.focus();
            return;
        }
        UI.mostrarAviso(aviso, 'Cadastro de demonstração: este protótipo não tem servidor, ' +
            'então nenhum dado foi enviado nem guardado.');
    });
})();
