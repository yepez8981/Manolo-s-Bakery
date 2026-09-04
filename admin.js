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

    /* Defaults iniciales */
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
        try { localStorage.setItem(key, JSON.stringify(data)); }
        catch (e) { console.warn('localStorage no disponible:', e); }
        pushAllToServer();
    }

    function saveToLocalOnly(key, data) {
        try { localStorage.setItem(key, JSON.stringify(data)); }
        catch (e) { console.warn('localStorage no disponible:', e); }
    }

    /* =========================================================
       SERVER SYNC
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
            if (data && data.status === 'success') {
                toast('Sincronizado con el servidor', 'success');
            } else {
                toast('Error al sincronizar', 'error');
            }
        })
        .catch(function () {
            toast('Sin conexión — guardado local', 'info');
        });
    }

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
                    toast('Config cargada del servidor', 'success');
                }
            })
            .catch(function () { });
    }

    /* =========================================================
       REVERSE MAP & getData
    ========================================================= */
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
       SLUGIFY
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
    function qsa(sel) { return document.querySelectorAll(sel); }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /* =========================================================
       TOAST NOTIFICATIONS
    ========================================================= */
    function toast(message, type) {
        type = type || 'info';
        var container = $('toastContainer');
        if (!container) return;

        var el = document.createElement('div');
        el.className = 'toast toast-' + type;
        el.textContent = message;
        container.appendChild(el);

        setTimeout(function () {
            el.classList.add('toast-exit');
            setTimeout(function () { el.remove(); }, 300);
        }, 3000);
    }

    /* =========================================================
       CONFIRM MODAL
    ========================================================= */
    function confirmAction(title, message) {
        return new Promise(function (resolve) {
            var overlay = $('confirmModal');
            var titleEl = $('confirmTitle');
            var msgEl = $('confirmMessage');
            var okBtn = $('confirmOk');
            var cancelBtn = $('confirmCancel');

            titleEl.textContent = title;
            msgEl.textContent = message;
            overlay.style.display = 'flex';

            function close(result) {
                overlay.style.display = 'none';
                okBtn.removeEventListener('click', onOk);
                cancelBtn.removeEventListener('click', onCancel);
                overlay.removeEventListener('click', onBg);
                resolve(result);
            }

            function onOk() { close(true); }
            function onCancel() { close(false); }
            function onBg(e) { if (e.target === overlay) close(false); }

            okBtn.addEventListener('click', onOk);
            cancelBtn.addEventListener('click', onCancel);
            overlay.addEventListener('click', onBg);
        });
    }

    /* =========================================================
       UPDATE STATS & COUNTS
    ========================================================= */
    function updateStats() {
        var scCakes = getData(KEYS.showcaseCakes);
        var scSizes = getData(KEYS.showcaseSizes);
        var ctTypes = getData(KEYS.customTypes);
        var csSizes = getData(KEYS.customSizes);
        var fl = getData(KEYS.fillings);
        var ly = getData(KEYS.layers);

        /* Sidebar counts */
        setText('count-showcase-cakes', scCakes.length);
        setText('count-showcase-sizes', scSizes.length);
        setText('count-custom-types', ctTypes.length);
        setText('count-custom-sizes', csSizes.length);
        setText('count-fillings', fl.length);
        setText('count-layers', ly.length);

        /* Stat cards */
        setText('stat-sc-cakes', scCakes.length);
        setText('stat-sc-fixed', scCakes.filter(function (c) { return c.fixedSize; }).length);
        setText('stat-sc-sizes', scSizes.length);
        setText('stat-ct-types', ctTypes.length);
        setText('stat-cs-sizes', csSizes.length);
        setText('stat-fl-fillings', fl.length);
        setText('stat-ly-layers', ly.length);
    }

    function setText(id, val) {
        var el = $(id);
        if (el) el.textContent = val;
    }

    /* =========================================================
       LOGIN / LOGOUT
    ========================================================= */
    function initLogin() {
        var loginBtn = $('loginBtn');
        var passwordInput = $('adminPassword');
        var loginError = $('loginError');

        // SIEMPRE registrar el manejador del botón (aunque ya haya sesión),
        // para que tras cerrar sesión se pueda volver a ingresar.
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

        if (loginBtn) loginBtn.addEventListener('click', doLogin);
        if (passwordInput) passwordInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doLogin();
        });

        // Si ya hay sesión activa, entrar directo
        try {
            if (sessionStorage.getItem('manolos_admin_auth') === '1') {
                showDashboard();
            }
        } catch (e) { /* storage no disponible */ }
    }

    function showDashboard() {
        $('loginScreen').style.display = 'none';
        $('dashboard').style.display = 'block';
        renderAllTables();
        syncFromServer();
    }

    /* =========================================================
       SIDEBAR
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
        updateStats();
    }

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
                '<td><span class="item-number">' + (i + 1) + '</span></td>' +
                '<td><strong>' + escapeHtml(item.name) + '</strong></td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td>' + (item.fixedSize ? '<strong>' + escapeHtml(item.fixedSize) + '</strong>' : '<span style="color:var(--contrast-3)">—</span>') + '</td>' +
                '<td class="col-actions">' +
                    '<button type="button" class="btn-danger" onclick="deleteAdminItem(\'showcaseCakes\',' + i + ')">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

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
                '<td><span class="item-number">' + (i + 1) + '</span></td>' +
                '<td><strong>' + escapeHtml(item.label) + '</strong></td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button type="button" class="btn-danger" onclick="deleteAdminItem(\'showcaseSizes\',' + i + ')">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

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
                '<td><span class="item-number">' + (i + 1) + '</span></td>' +
                '<td><strong>' + escapeHtml(item.name) + '</strong></td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button type="button" class="btn-danger" onclick="deleteAdminItem(\'customTypes\',' + i + ')">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

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
                '<td><span class="item-number">' + (i + 1) + '</span></td>' +
                '<td><strong>' + escapeHtml(item.label) + '</strong></td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button type="button" class="btn-danger" onclick="deleteAdminItem(\'customSizes\',' + i + ')">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

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
                '<td><span class="item-number">' + (i + 1) + '</span></td>' +
                '<td><strong>' + escapeHtml(item.name) + '</strong></td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button type="button" class="btn-danger" onclick="deleteAdminItem(\'fillings\',' + i + ')">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

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
                '<td><span class="item-number">' + (i + 1) + '</span></td>' +
                '<td><strong>' + escapeHtml(item.label) + '</strong></td>' +
                '<td><code>' + escapeHtml(item.value) + '</code></td>' +
                '<td class="col-actions">' +
                    '<button type="button" class="btn-danger" onclick="deleteAdminItem(\'layers\',' + i + ')">Eliminar</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

    /* =========================================================
       ADD ACTIONS
    ========================================================= */
    function initAddButtons() {
        $('addShowcaseCake').addEventListener('click', function () {
            var name = $('sc-name').value.trim();
            var fixedSize = $('sc-fixed-size').value;
            if (!name) { toast('Escribe el nombre del pastel', 'error'); $('sc-name').focus(); return; }

            var data = getData(KEYS.showcaseCakes);
            var value = slugify(name);

            if (data.some(function (d) { return d.value === value; })) {
                toast('Ya existe un pastel con ese nombre', 'error'); return;
            }

            data.push({ value: value, name: name, fixedSize: fixedSize });
            save(KEYS.showcaseCakes, data);
            $('sc-name').value = '';
            $('sc-fixed-size').value = '';
            renderShowcaseCakes();
            updateStats();
            toast('Pastel agregado', 'success');
        });

        $('addShowcaseSize').addEventListener('click', function () {
            var val = $('ss-value').value.trim();
            var lbl = $('ss-label').value.trim();
            if (!val || !lbl) { toast('Completa value y etiqueta', 'error'); return; }

            var data = getData(KEYS.showcaseSizes);
            if (data.some(function (d) { return d.value === val; })) {
                toast('Ya existe un tamaño con ese value', 'error'); return;
            }

            data.push({ value: val, label: lbl });
            save(KEYS.showcaseSizes, data);
            $('ss-value').value = '';
            $('ss-label').value = '';
            renderShowcaseSizes();
            updateStats();
            toast('Tamaño agregado', 'success');
        });

        $('addCustomType').addEventListener('click', function () {
            var name = $('ct-name').value.trim();
            if (!name) { toast('Escribe el nombre del sabor', 'error'); $('ct-name').focus(); return; }

            var data = getData(KEYS.customTypes);
            var value = slugify(name);

            if (data.some(function (d) { return d.value === value; })) {
                toast('Ya existe un sabor con ese nombre', 'error'); return;
            }

            data.push({ value: value, name: name });
            save(KEYS.customTypes, data);
            $('ct-name').value = '';
            renderCustomTypes();
            updateStats();
            toast('Sabor agregado', 'success');
        });

        $('addCustomSize').addEventListener('click', function () {
            var lbl = $('cs-label').value.trim();
            if (!lbl) { toast('Escribe la etiqueta del tamaño', 'error'); $('cs-label').focus(); return; }

            var data = getData(KEYS.customSizes);
            var value = slugify(lbl);

            if (data.some(function (d) { return d.value === value; })) {
                toast('Ya existe un tamaño con ese nombre', 'error'); return;
            }

            data.push({ value: value, label: lbl });
            save(KEYS.customSizes, data);
            $('cs-label').value = '';
            renderCustomSizes();
            updateStats();
            toast('Tamaño agregado', 'success');
        });

        $('addFilling').addEventListener('click', function () {
            var name = $('fl-name').value.trim();
            if (!name) { toast('Escribe el nombre del relleno', 'error'); $('fl-name').focus(); return; }

            var data = getData(KEYS.fillings);
            var value = slugify(name);

            if (data.some(function (d) { return d.value === value; })) {
                toast('Ya existe un relleno con ese nombre', 'error'); return;
            }

            data.push({ value: value, name: name });
            save(KEYS.fillings, data);
            $('fl-name').value = '';
            renderFillings();
            updateStats();
            toast('Relleno agregado', 'success');
        });

        $('addLayer').addEventListener('click', function () {
            var val = $('ly-value').value.trim();
            var lbl = $('ly-label').value.trim();
            if (!val || !lbl) { toast('Completa value y etiqueta', 'error'); return; }

            var data = getData(KEYS.layers);
            if (data.some(function (d) { return d.value === val; })) {
                toast('Ya existe una capa con ese value', 'error'); return;
            }

            data.push({ value: val, label: lbl });
            save(KEYS.layers, data);
            $('ly-value').value = '';
            $('ly-label').value = '';
            renderLayers();
            updateStats();
            toast('Capa agregada', 'success');
        });
    }

    /* =========================================================
       DELETE ACTIONS (global function para botones onclick)
    ========================================================= */
    var renderMap = {
        showcaseCakes: renderShowcaseCakes,
        showcaseSizes: renderShowcaseSizes,
        customTypes: renderCustomTypes,
        customSizes: renderCustomSizes,
        fillings: renderFillings,
        layers: renderLayers
    };

    window.deleteAdminItem = function (cat, idx) {
        var key = KEYS[cat];
        if (!key) return;

        var data = getData(key);
        var item = data[idx];
        var itemName = item ? (item.name || item.label || item.value) : '';

        confirmAction(
            '¿Eliminar "' + itemName + '"?',
            'Esta acción no se puede deshacer.'
        ).then(function (confirmed) {
            if (!confirmed) return;

            data.splice(idx, 1);
            save(key, data);

            if (renderMap[cat]) renderMap[cat]();
            updateStats();
            toast('Eliminado correctamente', 'success');
        });
    };

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
       GLOBAL ERROR SURFACING (para no fallar en silencio)
    ========================================================= */
    window.addEventListener('error', function (e) {
        console.error('❌ Error en admin.js:', e.message, e.filename, e.lineno);
        toast('Ocurrió un error: ' + e.message, 'error');
    });
    window.addEventListener('unhandledrejection', function (e) {
        console.error('❌ Promesa rechazada:', e.reason);
    });

    /* =========================================================
       INIT
    ========================================================= */
    document.addEventListener('DOMContentLoaded', function () {
        try {
            initLogin();
            initSidebar();
            initAddButtons();
            initLogout();
            console.log('✅ Manolo Admin inicializado correctamente');
        } catch (err) {
            console.error('❌ Falló la inicialización:', err);
            toast('Error al iniciar el panel: ' + err.message, 'error');
        }
    });

})();
