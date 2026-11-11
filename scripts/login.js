/*
 * INK AGENDA - página de login
 * Validação simples, mostrar/ocultar senha e "Lembrar-me".
 */
(function () {
    'use strict';

    var UI = window.InkUI;

    var form = document.getElementById('form-login');
    var aviso = document.getElementById('aviso-login');
    var campoUsuario = document.getElementById('usuario');
    var campoSenha = document.getElementById('senha-login');
    var lembrar = document.getElementById('lembrar');
    var esqueci = document.getElementById('esqueci-senha');

    var CHAVE = 'inkagenda.usuario';

    form.noValidate = true;

    UI.ligarMostrarSenha(document.getElementById('mostrar-senha-login'), campoSenha);

    // "Lembrar-me" guarda SÓ o nome de usuário, neste navegador. A senha nunca é guardada.
    // O armazenamento pode estar bloqueado (modo privado, por exemplo), por isso o try/catch.
    function lerUsuarioSalvo() {
        try { return window.localStorage.getItem(CHAVE) || ''; } catch (erro) { return ''; }
    }

    function guardarUsuario(usuario) {
        try {
            if (usuario) { window.localStorage.setItem(CHAVE, usuario); } else { window.localStorage.removeItem(CHAVE); }
        } catch (erro) { /* sem armazenamento: o login segue normalmente */ }
    }

    var salvo = lerUsuarioSalvo();
    if (salvo) {
        campoUsuario.value = salvo;
        lembrar.checked = true;
    }

    function validar(input, mensagem) {
        if (input.value.trim()) { UI.limparErro(input); return true; }
        UI.mostrarErro(input, mensagem);
        return false;
    }

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        aviso.hidden = true;

        var usuarioOk = validar(campoUsuario, 'Informe seu usuário ou e-mail.');
        var senhaOk = validar(campoSenha, 'Informe sua senha.');
        if (!usuarioOk || !senhaOk) {
            (usuarioOk ? campoSenha : campoUsuario).focus();
            return;
        }

        guardarUsuario(lembrar.checked ? campoUsuario.value.trim() : '');
        UI.mostrarAviso(aviso, 'Login de demonstração: este protótipo não tem servidor, ' +
            'então ninguém foi autenticado.');
    });

    esqueci.addEventListener('click', function (evento) {
        evento.preventDefault();
        UI.mostrarAviso(aviso, 'A recuperação de senha não existe na demonstração, pois não há servidor.');
    });
})();
