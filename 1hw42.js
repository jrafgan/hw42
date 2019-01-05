$(function () {
    var preloader = $('#preloader');
    $(document).ajaxStart(function () {
        preloader.show();
    });
    $(document).ajaxStop(function () {
        preloader.hide();
    });
    var url;
    var latlng;
    var country;
    var translate

    var createInfo = function () {
        $.get(url, function (response) {
            country = response[0];
            latlng = country.latlng
            $('#name').text(country.name);
            $('#region').text(country.region);
            $('#subregion').text(country.subregion);
            $('#capital').text(country.capital);
            var flagUrl = country.flag;
            $('#flag').attr('src', flagUrl);
            var ul_1 = createList(country);
            $('#ul_1').append(ul_1);
            var container = L.DomUtil.get('mapid');
            if (container != null) {
                container._leaflet_id = null;
            }

            mymap = L.map('mapid').setView(latlng, 5);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 30,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoianJhZmdhbiIsImEiOiJjam9iYmo1ZmowYXR1M3JsN3Q3ZTVvbWtuIn0.9uFf3g13U3RCBwIEqwXJ5A'
            }).addTo(mymap);

            var M;
            var i = 0;
            var polygon = [];
            var popup = L.popup();

            function onMapClick(e) {
                popup
                    .setLatLng(e.latlng)
                    .setContent("To make polygon Click 3 places " + e.latlng.toString())
                    .openOn(mymap);
                M = e.latlng;
                polygonLat = M.lat;
                polygonLng = M.lng;
                polygon[i] = [M.lat, M.lng];
                i++;
                if (i === 3) {
                    L.polygon(polygon).addTo(mymap);
                    i = 0;
                }
            }

            var marker = L.marker(latlng).addTo(mymap);
            mymap.on('click', onMapClick);

        }).fail(function (jqXHR) {
            jAlert(jqXHR.responseText);
        });
    }

    $('#show').on('click', function (event) {
        var countryName = $('#country-name').val();
        url = 'https://restcountries.eu/rest/v2/name/' + countryName;
        createInfo();
    });

    $("#show-extra").click(function () {
        $("#ul_1").toggle(1000);
    });
    var createList = function (menuData) {
        $('#ul_1').html('');
        var list = '<ul class="1">';
        console.log(menuData);

        for (var key in country) {
            var childKey = country[key];

            for (key2 in Words) {
                if (key2 === key) {
                    key = Words[key2];
                }
            }

            list += '<li class="main_li">' + key;
            var list2 = '<ul class="2">';

            if (Array.isArray(childKey)) {

                if (typeof childKey[0] === 'object') {
                    var objKey = Object.keys(childKey[0]);
                    var objVal = Object.values(childKey[0]);
                    var list3 = '<ul>';
                    for (var i = 0; i < objKey.length; i++) {
                        list3 += '<li>' + objKey[i] + ' : ' + objVal[i] + '</li>';
                    }
                    list3 += '</ul>';
                    list2 += '<li>' + list3 + '</li>';
                } else {
                    list2 += '<li>' + childKey + '</li>';
                }
            } else if (typeof childKey === 'object') {
                var objKey = Object.keys(childKey);
                var objVal = Object.values(childKey);
                var list3 = '<ul>';
                for (var i = 0; i < objKey.length; i++) {
                    list3 += '<li>' + objKey[i] + ' : ' + objVal[i] + '</li>';
                }
                list3 += '</ul>';
                list2 += '<li>' + list3 + '</li>';
            } else {
                list2 += '<li>' + childKey + '</li>';
            }
            list2 += '</ul>';
            list += list2 + '</li>'
        }
        list += '</ul>';
        $('#ul_1').append(list);

    };

    var Words = {
        name: 'Название',
        topLevelDomain: 'Домен верхнего уровня',
        alpha2Code: 'Двухзначный код',
        alpha3Code: 'Трехзначный код',
        callingCodes: 'Телеф. код страны',
        capital: 'Столица',
        region: 'Регион',
        subregion: 'Субрегион',
        population: 'Население',
        latlng: 'Геокоординаты',
        demonym: 'Этнохороним',
        area: 'Площадь',
        timezones: 'Часовой пояс',
        borders: 'Граничит',
        currencies: 'Валюта',
        languages: 'Языки',
        translations: 'Перевод',
        gini: 'индекс Джини',
        cioc: 'Код Между-го олимпийского комитета',
        nativeName: 'Оригинальное название',
        numericCode: 'Номерной код',
        altSpellings: 'Альтернативное название',
        regionalBlocs: 'Участник организаций'
    };
});