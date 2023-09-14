$(function () {
    'use strict';
    $('.links .menu').click(function () {
        $('.links .all-links').toggle('block');
    });

    $('.all-links li').click(function () {
        const clickedE = $(this).get(0);
        $(this).find('ul').toggle('block').siblings('li').find('ul').toggle('none');
    });
})