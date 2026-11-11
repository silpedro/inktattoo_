/*
 * INK AGENDA - regras de validação
 * Funções puras (sem acesso à página), por isso podem ser testadas à parte:
 * abra tests/validacao.test.html no navegador para rodar os testes.
 */
(function (raiz) {
    'use strict';

    // Requisitos da senha: cada chave vira um item da lista na tela de cadastro.
    function requisitosSenha(senha) {
        return {
            tamanho: senha.length >= 8,
            letrasENumeros: /\p{L}/u.test(senha) && /\p{N}/u.test(senha),
            especial: /[^\p{L}\p{N}\s]/u.test(senha),
            maiusculaEMinuscula: /\p{Ll}/u.test(senha) && /\p{Lu}/u.test(senha)
        };
    }

    function senhaValida(senha) {
        var requisitos = requisitosSenha(senha);
        return Object.keys(requisitos).every(function (chave) {
            return requisitos[chave];
        });
    }

    // Formata enquanto a pessoa digita: (11) 91234-5678 ou (11) 1234-5678
    function mascararTelefone(valor) {
        var digitos = String(valor).replace(/\D/g, '').slice(0, 11);
        if (digitos.length === 0) { return ''; }
        if (digitos.length <= 2) { return '(' + digitos; }
        var ddd = digitos.slice(0, 2);
        var resto = digitos.slice(2);
        if (digitos.length <= 6) { return '(' + ddd + ') ' + resto; }
        var corte = digitos.length > 10 ? 5 : 4;
        return '(' + ddd + ') ' + resto.slice(0, corte) + '-' + resto.slice(corte);
    }

    // 10 dígitos (fixo) ou 11 (celular, que começa com 9 depois do DDD); DDD de 11 a 99.
    function telefoneValido(valor) {
        var digitos = String(valor).replace(/\D/g, '');
        if (digitos.length !== 10 && digitos.length !== 11) { return false; }
        if (!/^[1-9][1-9]/.test(digitos)) { return false; }
        if (digitos.length === 11 && digitos.charAt(2) !== '9') { return false; }
        return true;
    }

    function emailValido(valor) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valor).trim());
    }

    // Data no formato aaaa-mm-dd (o do input type="date").
    // Devolve '' se estiver certa ou o texto do erro. "hoje" entra por parâmetro para facilitar o teste.
    function erroDaData(valor, hoje) {
        if (!valor) { return 'Informe a data de nascimento.'; }
        var partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
        if (!partes) { return 'Informe uma data válida.'; }
        var ano = Number(partes[1]);
        var mes = Number(partes[2]);
        var dia = Number(partes[3]);
        var data = new Date(ano, mes - 1, dia);
        var existe = data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
        if (!existe) { return 'Informe uma data válida.'; }
        if (ano < 1900) { return 'Informe uma data a partir de 1900.'; }
        var limite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        if (data > limite) { return 'A data de nascimento não pode ser no futuro.'; }
        return '';
    }

    // aaaa-mm-dd com o dia local (toISOString usaria UTC e poderia errar o dia)
    function hojeISO(hoje) {
        var mes = String(hoje.getMonth() + 1).padStart(2, '0');
        var dia = String(hoje.getDate()).padStart(2, '0');
        return hoje.getFullYear() + '-' + mes + '-' + dia;
    }

    var api = {
        requisitosSenha: requisitosSenha,
        senhaValida: senhaValida,
        mascararTelefone: mascararTelefone,
        telefoneValido: telefoneValido,
        emailValido: emailValido,
        erroDaData: erroDaData,
        hojeISO: hojeISO
    };

    raiz.InkValidacao = api;
    if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
})(typeof window !== 'undefined' ? window : this);
