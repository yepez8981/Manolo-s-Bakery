/**
 * admin.js — Panel de administración Manolo's Bakery
 * Gestiona pasteles de vitrina, personalizado, rellenos y capas.
 * Persiste en localStorage con prefijo "manolos_".
 */

(function () {
    'use strict';

    /* =========================================================
       CONFIG
    ========================================================= */
    var ADMIN_PASSWORD = 'Valen.220610@';
    var STORAGE_PREFIX = 'manolos_';

    var KEYS = {
        showcaseCakes:  STORAGE_PREFIX + 'admin_showcase_cakes',
        showcaseSizes:   STORAGE_PREFIX + 'admin_showcase_sizes',
        customTypes:     STORAGE_PREFIX + 'admin_custom_types',
        customSizes:     STORAGE_PREFIX + 'admin_custom_sizes',
        fillings:        STORAGE_PREFIX + 'admin_fillings',
        layers:          STORAGE_PREFIX + 'admin_layers'
    };

    /* Defaults iniciales (se usan la primera vez) */
    var DEFAULTS = {
        showcaseCakes: [
            { value: 'churros_tres_leches', name: 'Pastel Churros Tres Leches', fixedSize: '' },
            { value: 'nutella_tres_leches', name: 'Pastel de Nutella Tres Leches', fixedSize: '' },
            { value: 'plain_tres_leches', name: 'Pastel Plain Tres Leches', fixedSize: '' },
            { value: 'caramelo_tres_leches', name: 'Pastel Caramelo Tres Leches', fixedSize: '' },
            { value: 'melocoton_chocolate_oscuro_tres_leches', name: 'Pastel Melocotón Chocolate Oscuro Tres Leches', fixedSize: '' },
            { value: 'melocoton_chocolate_blanco_tres_leches', name: 'Pastel Melocotón Chocolate Blanco Tres Leches', fixedSize: '' },
            { value: 'cheerwine_tres_leches', name: 'Pastel Cheerwine Tres Leches', fixedSize: '' },
            { value: 'nuez_tres_leches', name: 'Pastel Nuez Tres Leches', fixedSize: '' },
            { value: 'chocolate_tres_leches', name: 'Pastel Chocolate Tres Leches', fixedSize: '' },
            { value: 'moca_cake', name: 'Pastel Moca', fixedSize: '' },
            { value: 'red_velvet_cake', name: 'Pastel Red Velvet', fixedSize: '' },
            { value: 'maracuya_cake', name: 'Pastel Maracuya', fixedSize: '' },
            { value: 'torta_chilena_10_inch', name: 'Pastel Torta Chilena (solo 10")', fixedSize: '10' },
            { value: 'pastel_amor_10_inch', name: 'Pastel Amor (solo 10")', fixedSize: '10' },
            { value: 'cheesecake_oreo_10_inch', name: 'Cheesecake Oreo (solo 10")', fixedSize: '10' },
            { value: 'cheesecake_fresa_10_inch', name: 'Cheesecake Fresa (solo 10")', fixedSize: '10' },
            { value: 'cheesecake_caramelo_10_inch', name: 'Cheesecake Caramelo (solo 10")', fixedSize: '10' },
            { value: 'cheesecake_plain_10_inch', name: 'Cheesecake (solo 10")', fixedSize: '10' },
            { value: 'flan_10_inch', name: 'Flan (solo 10")', fixedSize: '10' },
            { value: 'chocoflan_10_inch', name: 'Chocoflan (solo 10")', fixedSize: '10' },
            { value: 'tiramisu_10_inch', name: 'Tiramisu (solo 10")', fixedSize: '10' },
            { value: 'lemon_pie_10_inch', name: 'Lemon Pie (solo 10")', fixedSize: '10' },
            { value: 'pandebono_cake_10_inch', name: 'Pandebono Cake (solo 10")', fixedSize: '10' },
            { value: 'brownie_gluten_free_vegan', name: 'Brownie Sin Gluten Vegano (solo 7" y 9.5")', fixedSize: '7_9.5' }
        ],
        showcaseSizes: [
            { value: '6', label: '6"' },
            { value: '8', label: '8"' },
            { value: '10', label: '10"' },
            { value: '12', label: '12"' },
            { value: '14', label: '14"' }
        ],
        customTypes: [
            { value: 'tres_leches_vainilla', name: 'Tres Leches / Vainilla' },
            { value: 'tres_leches_chocolate', name: 'Tres Leches / Chocolate' },
            { value: 'vainilla_seco', name: 'Vainilla Seco' },
            { value: 'chocolate_seco', name: 'Chocolate Seco' },
            { value: 'marmolado', name: 'Marmolado' },
            { value: 'mocca', name: 'Mocca' },
            { value: 'maracuya', name: 'Maracuyá' }
        ],
        customSizes: [
            { value: 'circular_6', label: 'Circular 6"' },
            { value: 'circular_8', label: 'Circular 8"' },
            { value: 'circular_10', label: 'Circular 10"' },
            { value: 'circular_12', label: 'Circular 12"' },
            { value: 'circular_14', label: 'Circular 14"' },
            { value: 'cuadrado_1_4', label: 'Cuadrado 1/4 Sheet' },
            { value: 'rectangular_1_2', label: 'Rectangular 1/2 Sheet' },
            { value: 'Sheet (Plancha Completa)', label: 'Sheet (Plancha Completa)' }
        ],
        fillings: [
            { value: 'peach', name: 'Durazno' },
            { value: 'walnut', name: 'Nuez' },
            { value: 'chocolate_chips', name: 'Chocolate Chips' },
            { value: 'mocha', name: 'Mocca' },
            { value: 'cherry', name: 'Cereza' },
            { value: 'strawberry_natural', name: 'Fresa Natural' },
            { value: 'strawberry_jam', name: 'Fresa Mermelada' },
            { value: 'chocolate_dry', name: 'Chocolate Seco' },
            { value: 'pineapple_jam', name: 'Piña Mermelada' },
            { value: 'caramel', name: 'Caramelo' },
            { value: 'nutella', name: 'Nutella' },
            { value: 'pistachio', name: 'Pistacho' }
        ],
        layers: [
            { value: '0', label: 'Sin Capas - No layers' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' },
            { value: '6', label: '6' }
        ]
    };

    /* =========================================================
       STORAGE HELPERS
    ========================================================= */
    function load(key) {
        try {
            var raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
        } catch (e) { /* ignore */ }
        return null;
    }

    function save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        pushAllToServer();
    }

    /* =========================================================
       SERVER SYNC (guardar config en la hoja de Google)
    ========================================================= */
    var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxr0_krlnTJOid509YzSllhnKhNUYigmelcTK6fReMvMTM5L6XVUU3UqMmp-kQpvyI-/exec';

    function buildFullConfig() {
        var config = {};
        Object.keys(KEYS).forEach(function (k) {
            config[k] = getData(KEYS[k]);
        });
        return config;
    }

    function pushAllToServer() {
        var config = buildFullConfig();
        var body = {
            action: 'setConfig',
            password: ADMIN_PASSWORD,
            config: config
        };
        fetch(SCRIPT_URL, {
            method: 'POST',
            contentType: 'text/plain;charset=utf-8',
            body: JSON.stringify(body)
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!data || data.status !== 'success') {
                console.log('Admin sync falló:', data);
            }
        })
        .catch(function (err) {
            console.log('Admin sync error:', err);
        });
    }

    /* reverse map: storage key → DEFAULTS short key */
    var SHORT_KEYS = {};
    Object.keys(KEYS).forEach(function (k) { SHORT_KEYS[KEYS[k]] = k; });

    function getData(key) {
        var data = load(key);
        if (!data) {
            var short = SHORT_KEYS[key];
            data = (short && DEFAULTS[short]) ? JSON.parse(JSON.stringify(DEFAULTS[short])) : [];
            save(key, data);
        }
        return data;
    }

    /* =========================================================
       SLUGIFY — genera value a partir del nombre
    ========================================================= */
    function slugify(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_|_$/g, '');
    }

    /* =========================================================
       DOM HELPERS
    ========================================================= */
    function $(id) { return document.getElementById(id); }
    function qs(sel) { return document.querySelector(sel); }
    function qsa(sel) { return document.querySelectorAll(sel); }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /* =========================================================
       LOGIN / LOGOUT
    ========================================================= */
    function initLogin() {
        var loginBtn = $('loginBtn');
        var passwordInput = $('adminPassword');
        var loginError = $('loginError');

        if (sessionStorage.getItem('manolos_admin_auth') === '1') {
            showDashboard();
            return;
        }

        loginBtn.addEventListener('click', doLogin);
        passwordInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doLogin();
        });

        function doLogin() {
            if (passwordInput.value === ADMIN_PASSWORD) {
                sessionStorage.setItem('manolos_admin_auth', '1');
                loginError.style.display = 'none';
                showDashboard();
            } else {
                loginError.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
    }

    function showDashboard() {
        $('loginScreen').style.display = 'none';
        $('dashboard').style.display = 'block';
        renderAllTables();
        syncFromServer();
    }

    /* Load config from the server into localStorage, then re-render. */
    function syncFromServer() {
        fetch(SCRIPT_URL + '?action=getConfig', { method: 'GET' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data && data.status === 'success' && data.config) {
                    Object.keys(KEYS).forEach(function (k) {
                        var list = data.config[k];
                        if (Array.isArray(list)) {
                            saveToLocalOnly(KEYS[k], list);
                        }
                    });
                    renderAllTables();
                }
            })
            .catch(function () { /* queda lo loca */ });
    }

    function saveToLocalOnly(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    /* =========================================================
       SIDEBAR NAVIGATION
    ========================================================= */
    function initSidebar() {
        var buttons = qsa('.sidebar-btn');
        var sections = qsa('.admin-section');

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('active'); });
                sections.forEach(function (s) { s.classList.remove('active'); });

                btn.classList.add('active');
                var target = $(btn.dataset.section);
                if (target) target.classList.add('active');
            });
        });
    }

    /* =========================================================
       RENDER TABLES
    ========================================================= */
    function renderAllTables() {
        renderShowcaseCakes();
        renderShowcaseSizes();
        renderCustomTypes();
        renderCustomSizes();
        renderFillings();
        renderLayers();
    }

    /* --- Showcase Cakes --- */
    function renderShowcaseCakes() {
        var data = getData(KEYS.showcaseCakes);
        var tbody = $('showcaseCakesTable');
        var empty = $('showcaseCakesEmpty');

        if (data.length === 0) {
            tbody.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';

        tbody.innerHTML = data.map(function (item, i) {
            return '<tr>' +
                '<td>' + escapeHtml(item.name) + '</td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td>' + escapeHtml(item.fixedSize || '—') + '</td>' +
                '<td class="col-actions">' +
                    '<button class="btn-danger" data-action="delete" data-cat="showcaseCakes" data-idx="' + i + '">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

    /* --- Showcase Sizes --- */
    function renderShowcaseSizes() {
        var data = getData(KEYS.showcaseSizes);
        var tbody = $('showcaseSizesTable');
        var empty = $('showcaseSizesEmpty');

        if (data.length === 0) {
            tbody.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';

        tbody.innerHTML = data.map(function (item, i) {
            return '<tr>' +
                '<td>' + escapeHtml(item.label) + '</td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button class="btn-danger" data-action="delete" data-cat="showcaseSizes" data-idx="' + i + '">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

    /* --- Custom Types --- */
    function renderCustomTypes() {
        var data = getData(KEYS.customTypes);
        var tbody = $('customTypesTable');
        var empty = $('customTypesEmpty');

        if (data.length === 0) {
            tbody.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';

        tbody.innerHTML = data.map(function (item, i) {
            return '<tr>' +
                '<td>' + escapeHtml(item.name) + '</td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button class="btn-danger" data-action="delete" data-cat="customTypes" data-idx="' + i + '">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

    /* --- Custom Sizes --- */
    function renderCustomSizes() {
        var data = getData(KEYS.customSizes);
        var tbody = $('customSizesTable');
        var empty = $('customSizesEmpty');

        if (data.length === 0) {
            tbody.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';

        tbody.innerHTML = data.map(function (item, i) {
            return '<tr>' +
                '<td>' + escapeHtml(item.label) + '</td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button class="btn-danger" data-action="delete" data-cat="customSizes" data-idx="' + i + '">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

    /* --- Fillings --- */
    function renderFillings() {
        var data = getData(KEYS.fillings);
        var tbody = $('fillingsTable');
        var empty = $('fillingsEmpty');

        if (data.length === 0) {
            tbody.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';

        tbody.innerHTML = data.map(function (item, i) {
            return '<tr>' +
                '<td>' + escapeHtml(item.name) + '</td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button class="btn-danger" data-action="delete" data-cat="fillings" data-idx="' + i + '">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

    /* --- Layers --- */
    function renderLayers() {
        var data = getData(KEYS.layers);
        var tbody = $('layersTable');
        var empty = $('layersEmpty');

        if (data.length === 0) {
            tbody.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';

        tbody.innerHTML = data.map(function (item, i) {
            return '<tr>' +
                '<td>' + escapeHtml(item.label) + '</td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button class="btn-danger" data-action="delete" data-cat="layers" data-idx="' + i + '">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

    /* =========================================================
       ADD ACTIONS
    ========================================================= */
    function initAddButtons() {
        /* Showcase Cakes */
        $('addShowcaseCake').addEventListener('click', function () {
            var name = $('sc-name').value.trim();
            var fixedSize = $('sc-fixed-size').value;
            if (!name) { alert('Escribe el nombre del pastel'); return; }

            var data = getData(KEYS.showcaseCakes);
            var value = slugify(name);

            /* Evitar duplicados */
            if (data.some(function (d) { return d.value === value; })) {
                alert('Ya existe un pastel con ese nombre'); return;
            }

            data.push({ value: value, name: name, fixedSize: fixedSize });
            save(KEYS.showcaseCakes, data);
            $('sc-name').value = '';
            $('sc-fixed-size').value = '';
            renderShowcaseCakes();
        });

        /* Showcase Sizes */
        $('addShowcaseSize').addEventListener('click', function () {
            var val = $('ss-value').value.trim();
            var lbl = $('ss-label').value.trim();
            if (!val || !lbl) { alert('Completa value y etiqueta'); return; }

            var data = getData(KEYS.showcaseSizes);
            if (data.some(function (d) { return d.value === val; })) {
                alert('Ya existe un tamaño con ese value'); return;
            }

            data.push({ value: val, label: lbl });
            save(KEYS.showcaseSizes, data);
            $('ss-value').value = '';
            $('ss-label').value = '';
            renderShowcaseSizes();
        });

        /* Custom Types */
        $('addCustomType').addEventListener('click', function () {
            var name = $('ct-name').value.trim();
            if (!name) { alert('Escribe el nombre del sabor'); return; }

            var data = getData(KEYS.customTypes);
            var value = slugify(name);

            if (data.some(function (d) { return d.value === value; })) {
                alert('Ya existe un sabor con ese nombre'); return;
            }

            data.push({ value: value, name: name });
            save(KEYS.customTypes, data);
            $('ct-name').value = '';
            renderCustomTypes();
        });

        /* Custom Sizes */
        $('addCustomSize').addEventListener('click', function () {
            var lbl = $('cs-label').value.trim();
            if (!lbl) { alert('Escribe la etiqueta del tamaño'); return; }

            var data = getData(KEYS.customSizes);
            var value = slugify(lbl);

            if (data.some(function (d) { return d.value === value; })) {
                alert('Ya existe un tamaño con ese nombre'); return;
            }

            data.push({ value: value, label: lbl });
            save(KEYS.customSizes, data);
            $('cs-label').value = '';
            renderCustomSizes();
        });

        /* Fillings */
        $('addFilling').addEventListener('click', function () {
            var name = $('fl-name').value.trim();
            if (!name) { alert('Escribe el nombre del relleno'); return; }

            var data = getData(KEYS.fillings);
            var value = slugify(name);

            if (data.some(function (d) { return d.value === value; })) {
                alert('Ya existe un relleno con ese nombre'); return;
            }

            data.push({ value: value, name: name });
            save(KEYS.fillings, data);
            $('fl-name').value = '';
            renderFillings();
        });

        /* Layers */
        $('addLayer').addEventListener('click', function () {
            var val = $('ly-value').value.trim();
            var lbl = $('ly-label').value.trim();
            if (!val || !lbl) { alert('Completa value y etiqueta'); return; }

            var data = getData(KEYS.layers);
            if (data.some(function (d) { return d.value === val; })) {
                alert('Ya existe una capa con ese value'); return;
            }

            data.push({ value: val, label: lbl });
            save(KEYS.layers, data);
            $('ly-value').value = '';
            $('ly-label').value = '';
            renderLayers();
        });
    }

    /* =========================================================
       DELETE ACTIONS (delegated)
    ========================================================= */
    function initDeleteDelegation() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-action="delete"]');
            if (!btn) return;

            var cat = btn.dataset.cat;
            var idx = parseInt(btn.dataset.idx, 10);
            var key = KEYS[cat];

            if (!key) return;

            var data = getData(key);
            var itemName = data[idx] ? (data[idx].name || data[idx].label || data[idx].value) : '';

            if (!confirm('¿Eliminar "' + itemName + '"?')) return;

            data.splice(idx, 1);
            save(key, data);

            /* Re-render la tabla correspondiente */
            var renderMap = {
                showcaseCakes: renderShowcaseCakes,
                showcaseSizes: renderShowcaseSizes,
                customTypes: renderCustomTypes,
                customSizes: renderCustomSizes,
                fillings: renderFillings,
                layers: renderLayers
            };

            if (renderMap[cat]) renderMap[cat]();
        });
    }

    /* =========================================================
       LOGOUT
    ========================================================= */
    function initLogout() {
        $('logoutBtn').addEventListener('click', function () {
            sessionStorage.removeItem('manolos_admin_auth');
            $('dashboard').style.display = 'none';
            $('loginScreen').style.display = 'flex';
            $('adminPassword').value = '';
            $('adminPassword').focus();
        });
    }

    /* =========================================================
       INIT
    ========================================================= */
    document.addEventListener('DOMContentLoaded', function () {
        initLogin();
        initSidebar();
        initAddButtons();
        initDeleteDelegation();
        initLogout();
    });

})();
