/*
 * INK AGENDA - página de cadastro
 * Nesta etapa: alterna os campos de tatuador e impede o envio real do formulário.
 */
(function () {
    'use strict';

    var form = document.getElementById('form-cadastro');
    var aviso = document.getElementById('aviso-demo');
    var camposTatuador = form.querySelectorAll('[data-somente="tatuador"]');
    var campoEstudio = document.getElementById('estudio');

    // Mostra (ou esconde) os campos que só o tatuador preenche.
    // Campos escondidos ficam desabilitados, para não bloquear o envio.
    function aplicarTipo(tipo) {
        var ehTatuador = tipo === 'tatuador';
        camposTatuador.forEach(function (campo) {
            campo.hidden = !ehTatuador;
            campo.querySelectorAll('input').forEach(function (input) {
                input.disabled = !ehTatuador;
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
        radio.addEventListener('change', function () {
            aplicarTipo(tipoSelecionado());
        });
    });
    aplicarTipo(tipoSelecionado());

    // Não há servidor: o formulário nunca é enviado, para que nenhum dado (principalmente a senha)
    // vá parar na barra de endereço ou em algum lugar sem querer.
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        aviso.textContent = 'Cadastro de demonstração: este protótipo não tem servidor, ' +
            'então nenhum dado foi enviado nem guardado.';
        aviso.hidden = false;
    });
})();
