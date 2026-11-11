/*
 * INK AGENDA - utilitários de interface usados pelo login e pelo cadastro
 */
(function (raiz) {
    'use strict';

    function descritoresDe(input) {
        return (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    }

    function definirDescritores(input, lista) {
        if (lista.length) {
            input.setAttribute('aria-describedby', lista.join(' '));
        } else {
            input.removeAttribute('aria-describedby');
        }
    }

    // Mostra a mensagem de erro logo abaixo do campo e liga o erro ao campo para leitores de tela.
    function mostrarErro(input, mensagem) {
        var campo = input.closest('.campo');
        var idErro = 'erro-' + input.id;
        var erro = document.getElementById(idErro);
        if (!erro) {
            erro = document.createElement('p');
            erro.className = 'erro';
            erro.id = idErro;
            campo.appendChild(erro);
        }
        erro.textContent = mensagem;
        input.setAttribute('aria-invalid', 'true');
        var descritores = descritoresDe(input);
        if (descritores.indexOf(idErro) === -1) { descritores.push(idErro); }
        definirDescritores(input, descritores);
    }

    function limparErro(input) {
        var idErro = 'erro-' + input.id;
        var erro = document.getElementById(idErro);
        if (erro) { erro.remove(); }
        input.removeAttribute('aria-invalid');
        definirDescritores(input, descritoresDe(input).filter(function (id) { return id !== idErro; }));
    }

    // Botão "Mostrar/Ocultar" ao lado do campo de senha.
    function ligarMostrarSenha(botao, input) {
        botao.addEventListener('click', function () {
            var vaiMostrar = input.type === 'password';
            input.type = vaiMostrar ? 'text' : 'password';
            botao.textContent = vaiMostrar ? 'Ocultar' : 'Mostrar';
            botao.setAttribute('aria-pressed', String(vaiMostrar));
        });
    }

    // Mensagem de demonstração (o protótipo não tem servidor).
    function mostrarAviso(elemento, texto) {
        elemento.textContent = texto;
        elemento.hidden = false;
    }

    raiz.InkUI = {
        mostrarErro: mostrarErro,
        limparErro: limparErro,
        ligarMostrarSenha: ligarMostrarSenha,
        mostrarAviso: mostrarAviso
    };
})(window);
