function showNotice(message, type, options) {
    type = (type === 'success' || type === 'error') ? type : 'info';
    options = options || {};

    var container = document.getElementById('app-notice-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'app-notice-container';
        container.className = 'app-notice-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
    }

    var notice = document.createElement('div');
    notice.className = 'app-notice app-notice--' + type;
    notice.setAttribute('role', type === 'error' ? 'alert' : 'status');
    notice.innerHTML =
        '<span class="app-notice__icon" aria-hidden="true"></span>' +
        '<span class="app-notice__message"></span>' +
        '<button type="button" class="app-notice__close" aria-label="Cerrar">&times;</button>';
    notice.querySelector('.app-notice__message').textContent = message;

    function remove() {
        notice.classList.add('app-notice--hide');
        setTimeout(function () { notice.remove(); }, 200);
    }

    notice.querySelector('.app-notice__close').addEventListener('click', remove);
    container.appendChild(notice);

    if (!options.sticky) {
        setTimeout(remove, options.duration || 5500);
    }

    return notice;
}

/* loadCakeConfig — rebuilds form dropdowns/checkboxes.
   Source order: server config → localStorage → defaults (HTML). */
function loadCakeConfig(serverConfig) {
    var PREFIX = 'manolos_';
    var KEYS = {
        showcaseCakes: PREFIX + 'admin_showcase_cakes',
        showcaseSizes:  PREFIX + 'admin_showcase_sizes',
        customTypes:    PREFIX + 'admin_custom_types',
        customSizes:    PREFIX + 'admin_custom_sizes',
        fillings:       PREFIX + 'admin_fillings',
        layers:         PREFIX + 'admin_layers'
    };

    function read(key) {
        try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
    }

    function pick(serverKey, localKey) {
        if (serverConfig && Array.isArray(serverConfig[serverKey]) && serverConfig[serverKey].length) {
            return serverConfig[serverKey];
        }
        return read(localKey);
    }

    /* ---- Showcase cakes → #sc-cake-select ---- */
    var cakes = pick('showcaseCakes', KEYS.showcaseCakes);
    var scSelect = document.getElementById('sc-cake-select');
    if (scSelect && Array.isArray(cakes) && cakes.length) {
        var placeholder = scSelect.querySelector('option[value=""]');
        scSelect.innerHTML = '';
        if (placeholder) scSelect.appendChild(placeholder);
        cakes.forEach(function (c) {
            var o = document.createElement('option');
            o.value = c.value;
            o.textContent = c.name;
            if (c.fixedSize) o.setAttribute('data-fixed-size', c.fixedSize);
            scSelect.appendChild(o);
        });
    }

    /* ---- Showcase sizes → #sc-cakeSize ---- */
    var sizes = pick('showcaseSizes', KEYS.showcaseSizes);
    var scSize = document.getElementById('sc-cakeSize');
    if (scSize && Array.isArray(sizes) && sizes.length) {
        var ph = scSize.querySelector('option[value=""]');
        scSize.innerHTML = '';
        if (ph) scSize.appendChild(ph);
        sizes.forEach(function (s) {
            var o = document.createElement('option');
            o.value = s.value;
            o.textContent = s.label;
            scSize.appendChild(o);
        });
    }

    /* ---- Custom types → #cc-cakeType (always keep "Otro") ---- */
    var types = pick('customTypes', KEYS.customTypes);
    var ccType = document.getElementById('cc-cakeType');
    if (ccType && Array.isArray(types) && types.length) {
        var ph2 = ccType.querySelector('option[value=""]');
        ccType.innerHTML = '';
        if (ph2) ccType.appendChild(ph2);
        types.forEach(function (t) {
            var o = document.createElement('option');
            o.value = t.value;
            o.textContent = t.name;
            ccType.appendChild(o);
        });
        /* ensure "Otro" option exists */
        if (!ccType.querySelector('option[value="otro"]')) {
            var otro = document.createElement('option');
            otro.value = 'otro';
            otro.textContent = 'Otro';
            ccType.appendChild(otro);
        }
    }

    /* ---- Custom sizes → #cc-cakeSize ---- */
    var cSizes = pick('customSizes', KEYS.customSizes);
    var ccSize = document.getElementById('cc-cakeSize');
    if (ccSize && Array.isArray(cSizes) && cSizes.length) {
        var ph3 = ccSize.querySelector('option[value=""]');
        ccSize.innerHTML = '';
        if (ph3) ccSize.appendChild(ph3);
        cSizes.forEach(function (s) {
            var o = document.createElement('option');
            o.value = s.value;
            o.textContent = s.label;
            ccSize.appendChild(o);
        });
    }

    /* ---- Fillings → #cc-fillings-group (preserve "Otro" checkbox + container) ---- */
    var fillings = pick('fillings', KEYS.fillings);
    var fg = document.getElementById('cc-fillings-group');
    if (fg && Array.isArray(fillings) && fillings.length) {
        /* keep only #other-filling-container */
        var otherContainer = document.getElementById('other-filling-container');
        fg.innerHTML = '';
        fillings.forEach(function (f) {
            var wrap = document.createElement('div');
            var cb  = document.createElement('input');
            cb.type = 'checkbox';
            cb.id   = 'filling-' + f.value;
            cb.name = 'customFilling';
            cb.value = f.value;
            var lbl = document.createElement('label');
            lbl.setAttribute('for', cb.id);
            lbl.textContent = f.name;
            wrap.appendChild(cb);
            wrap.appendChild(lbl);
            fg.appendChild(wrap);
        });
        /* add "Otro" checkbox + hidden container */
        var otherWrap = document.createElement('div');
        var otherCb   = document.createElement('input');
        otherCb.type = 'checkbox';
        otherCb.id   = 'filling-other';
        otherCb.name = 'customFilling';
        otherCb.value = 'other';
        var otherLbl = document.createElement('label');
        otherLbl.setAttribute('for', 'filling-other');
        otherLbl.textContent = 'Otro';
        otherWrap.appendChild(otherCb);
        otherWrap.appendChild(otherLbl);
        fg.appendChild(otherWrap);
        if (otherContainer) fg.appendChild(otherContainer);
        else {
            var OC = document.createElement('div');
            OC.id = 'other-filling-container';
            OC.style.cssText = 'display:none;margin-top:10px;';
            var inp = document.createElement('input');
            inp.type = 'text';
            inp.id = 'other-filling-input';
            inp.placeholder = 'Especifica otro relleno...';
            inp.style.cssText = 'width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;';
            OC.appendChild(inp);
            fg.appendChild(OC);
        }
    }

    /* ---- Layers → #cc-flavor ---- */
    var layers = pick('layers', KEYS.layers);
    var ccFlavor = document.getElementById('cc-flavor');
    if (ccFlavor && Array.isArray(layers) && layers.length) {
        var ph4 = ccFlavor.querySelector('option[disabled]');
        ccFlavor.innerHTML = '';
        if (ph4) ccFlavor.appendChild(ph4);
        layers.forEach(function (l) {
            var o = document.createElement('option');
            o.value = l.value;
            o.textContent = l.label;
            ccFlavor.appendChild(o);
        });
    }
}

/* fetchServerConfig — loads config from Apps Script (global) and applies to form.
   Falls back to localStorage + defaults if the server is unreachable. */
function fetchServerConfig() {
    var CONFIG_URL = 'https://script.google.com/macros/s/AKfycbxr0_krlnTJOid509YzSllhnKhNUYigmelcTK6fReMvMTM5L6XVUU3UqMmp-kQpvyI-/exec?action=getConfig';
    try {
        fetch(CONFIG_URL)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data && data.status === 'success' && data.config) {
                    loadCakeConfig(data.config);
                }
            })
            .catch(function () { /* fallback a localStorage/defaults ya aplicado */ });
    } catch (e) { /* fallback */ }
}

document.addEventListener('DOMContentLoaded', function() {
    window.__USE_PREVIEW_FLOW__ = true;
    loadCakeConfig();
    fetchServerConfig();

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxr0_krlnTJOid509YzSllhnKhNUYigmelcTK6fReMvMTM5L6XVUU3UqMmp-kQpvyI-/exec";

    const MANOLOS_WHATSAPP_E164_NO_PLUS = "19802878716"; // <-- AJUSTAR SI HAY CAMBIO DE NUMERO
    const MANOLOS_PHONE_E164_PLUS       = "+19802878716"; // <-- AJUSTAR SI HAY CAMBIO DE NUMERO

    const langButtons = document.querySelectorAll('.lang-button');
    const orderForm = document.getElementById('cakeOrderForm');
    const orderDateInput = document.getElementById('orderDate');
    const deliveryDateInput = document.getElementById('deliveryDate');
    const cakeTypeHiddenInput = document.getElementById('cakeType');
    const showcaseCakeSelect = document.getElementById('sc-cake-select');
    const showcaseCakeSizeSelect = document.getElementById('sc-cakeSize'); // New
    // const customCakeDescription = document.getElementById('cc-description'); // No longer exists
    const customCakeSizeSelect = document.getElementById('cc-cakeSize'); // This ID is now for Shape and Size
    const customCakeTypeSelect = document.getElementById('cc-cakeType'); // New select for cake type
    const otherCakeTypeGroup = document.getElementById('cc-otherCakeTypeGroup'); // New group for other cake type
    const otherCakeTypeInput = document.getElementById('cc-otherCakeType'); // New input for other cake type
    const fillingsCheckboxesContainer = document.getElementById('cc-fillings-group'); // New container for fillings checkboxes
    const selectedFillingsDisplay = document.getElementById('selected-fillings-display'); // New display for selected fillings
    const fillingArrangementGroup = document.getElementById('cc-fillingArrangementGroup'); // New group for filling arrangement
    const fillingArrangementRadios = document.querySelectorAll('input[name="customFillingArrangement"]'); // Radios for arrangement
    const otroArrangementContainer = document.getElementById("cc-otroArrangementContainer");
    const otroArrangementInput = document.getElementById("cc-otroArrangementInput");

    fillingArrangementRadios.forEach(radio => {
    radio.addEventListener("change", function () {

        if (this.value === "otro" && this.checked) {
            if (otroArrangementContainer) otroArrangementContainer.style.display = "block";
        } else {
            if (otroArrangementContainer) {
                otroArrangementContainer.style.display = "none";
                if (otroArrangementInput) otroArrangementInput.value = "";
            }
        }
      });
    });

    const halfAndHalfSpecificationGroup = document.getElementById('cc-halfAndHalfSpecificationGroup'); // Group for half/half spec
    const half1FillingsInput = document.getElementById('cc-half1Fillings'); // Input for half 1
    const half2FillingsInput = document.getElementById('cc-half2Fillings'); // Input for half 2
    const submitButton = document.getElementById('submitOrderBtn');

    // Modal elements (OJO: hay dos confirmOrderBtn en el HTML)
    const orderPreviewModal = document.getElementById('orderPreviewModal');
    const previewOrderDetailsDiv = document.getElementById('previewOrderDetails');
    // Botón Confirmar del MODAL de preview (buscar DENTRO del modal para no chocar)
    const previewConfirmOrderBtn = orderPreviewModal ? orderPreviewModal.querySelector('#confirmOrderBtn') : null;
    const cancelPreviewBtn = document.getElementById('cancelPreviewBtn');

    // Zona de "estado de pedido" (el otro confirm)
    const confirmationActions = document.getElementById('confirmationActions');
    const statusConfirmBtn = confirmationActions ? confirmationActions.querySelector('#confirmOrderBtn') : null;

    // Decoration elements
    const decTopClosuresCheckbox = document.getElementById('dec-top-closures');
    const decTopClosuresToneGroup = document.getElementById('dec-top-closures-tone-group');
    const decTopClosuresToneSelect = document.getElementById('dec-top-closures-tone');
    const decBottomClosuresCheckbox = document.getElementById('dec-bottom-closures');
    const decBottomClosuresToneGroup = document.getElementById('dec-bottom-closures-tone-group');
    const decBottomClosuresToneSelect = document.getElementById('dec-bottom-closures-tone');
    const decRosettesCheckbox = document.getElementById('dec-rosettes');
    const decRosettesToneGroup = document.getElementById('dec-rosettes-tone-group');
    const decRosettesToneSelect = document.getElementById('dec-rosettes-tone');
    // New color specification fields
    const decTopClosuresColorSpecGroup = document.getElementById('dec-top-closures-color-spec-group');
    const decTopClosuresColorSpecInput = document.getElementById('dec-top-closures-color-spec');
    const decBottomClosuresColorSpecGroup = document.getElementById('dec-bottom-closures-color-spec-group');
    const decBottomClosuresColorSpecInput = document.getElementById('dec-bottom-closures-color-spec');
    const decRosettesColorSpecGroup = document.getElementById('dec-rosettes-color-spec-group');
    const decRosettesColorSpecInput = document.getElementById('dec-rosettes-color-spec');

    // Message options elements
    const cakeMessageTextarea = document.getElementById('cc-cakeMessage');
    const messageOptionsGroup = document.getElementById('cc-message-options-group');
    const messageLocationRadios = document.querySelectorAll('input[name="messageLocation"]');
    const messageColorSelect = document.getElementById('message-color');
    const messageFontSelect = document.getElementById('message-font');

    // Imagen referencia (custom)
    const customImageInput = document.getElementById('cc-image');
    let currentImageBase64 = ""; // guardamos base64 para enviar

    // Otro Relleno
    const otherFillingCheckbox = document.getElementById("filling-other");
    const otherFillingContainer = document.getElementById("other-filling-container");
    const otherFillingInput = document.getElementById("other-filling-input");

    if (otherFillingCheckbox) {
    otherFillingCheckbox.addEventListener("change", () => {
    if (otherFillingCheckbox.checked) {
      otherFillingContainer.style.display = "block";
    } else {
      otherFillingContainer.style.display = "none";
      otherFillingInput.value = "";
    }
    });
    }


    // ===== PREVIEW de imagen (sin tocar tu HTML): creamos contenedor debajo del input =====
    if (customImageInput) {
        const previewBox = document.createElement('div');
        previewBox.id = 'cc-image-preview-box';
        previewBox.className = 'image-preview-box';
        previewBox.style.display = 'none';
        previewBox.innerHTML = `
            <div class="image-preview-label">Vista previa:</div>
            <img id="cc-image-preview" alt="Vista previa" class="image-preview-img">
            <div id="cc-image-name" class="image-preview-name"></div>
        `;
        customImageInput.insertAdjacentElement('afterend', previewBox);

        customImageInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
            if (!file) {
                currentImageBase64 = "";
                previewBox.style.display = 'none';
                return;
            }
            try {
                const dataUrl = await readFileAsDataURL(file);
                currentImageBase64 = dataUrl; // guardamos como dataURL (base64)
                const img = document.getElementById('cc-image-preview');
                const name = document.getElementById('cc-image-name');
                if (img) img.src = dataUrl;
                if (name) name.textContent = file.name;
                previewBox.style.display = 'block';
            } catch (err) {
                console.error('Error leyendo imagen:', err);
                currentImageBase64 = "";
                previewBox.style.display = 'none';
            }
        });
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result);
            fr.onerror = reject;
            fr.readAsDataURL(file);
        });
    }

    // ===== Helpers NUEVOS para contacto según preferencia =====
    function buildOrderSummaryText(orderNumber, data, lang) {
      const L = (lang === "en") ? "en" : "es";
      const isShowcase = data.cakeType === "showcase";
      const line = (es, en) => (L === "en" ? en : es);
      const toLabel = (val, es, en) => line(`${es}: ${val || ""}`, `${en}: ${val || ""}`);

      let parts = [];
      parts.push(line(
        `Pedido #${orderNumber} – Manolo's Bakery`,
        `Order #${orderNumber} – Manolo's Bakery`
      ));
      parts.push(toLabel(data.customerName, "Cliente", "Customer"));
      parts.push(toLabel(`${data.deliveryDate || ""} ${data.deliveryTime || ""}`, "Entrega", "Delivery"));
      parts.push(toLabel(data.deliveryMethod, "Método", "Method"));

      // NUEVO: mostrar "Orden hecha por"
      if (data.customerNameEmpleado) {
        parts.push(toLabel(data.customerNameEmpleado, "Orden hecha por", "Order taken by"));
      }

      if (isShowcase) {
        parts.push(line(`Tipo de pastel: Vitrina`, `Cake type: Showcase`));
        if (data.showcaseCake) parts.push(toLabel(data.showcaseCake, "Modelo", "Model"));
        if (data.showcaseCakeSize) parts.push(toLabel(`${data.showcaseCakeSize}"`, "Tamaño", "Size"));
        if (data.showcaseCakeMessage) parts.push(toLabel(`"${data.showcaseCakeMessage}"`, "Mensaje", "Message"));
      } else {
        parts.push(line(`Tipo de pastel: Personalizado`, `Cake type: Custom`));
        if (data.customCakeSize) parts.push(toLabel(data.customCakeSize, "Forma/Tamaño", "Shape/Size"));
        if (data.customCakeType) {
          const extra = data.customOtherCakeType ? ` (${data.customOtherCakeType})` : "";
          parts.push(toLabel(`${data.customCakeType}${extra}`, "Sabor/base", "Flavor/base"));
        }
        if (Array.isArray(data.customFillings) && data.customFillings.length) {
          parts.push(toLabel(data.customFillings.join(", "), "Rellenos", "Fillings"));
        }
        if (data.customFillingArrangement) {
          parts.push(toLabel(data.customFillingArrangement, "Disposición", "Arrangement"));
        }
        if (data.customCakeMessage) parts.push(toLabel(`"${data.customCakeMessage}"`, "Mensaje", "Message"));
      }

      parts.push(line(
        `Tel cliente: ${data.phone || ""} | Email: ${data.email || ""}`,
        `Customer phone: ${data.phone || ""} | Email: ${data.email || ""}`
      ));

      const pref = (typeof data.contactMethod === "string") ? data.contactMethod : (Array.isArray(data.contactMethod) ? data.contactMethod[0] : "");
      parts.push(line(
        `Preferencia de contacto: ${pref}`,
        `Contact preference: ${pref}`
      ));

      // === Campos globales (corazón / foto / diseño) –– AÑADIDO
      const yn = (v) => v === "yes"
        ? line("Sí", "Yes")
        : v === "no"
          ? line("No", "No")
          : "";

      if (typeof data.heartShape !== "undefined") {
        parts.push(line(
          `¿Forma de corazón?: ${yn(data.heartShape)}`,
          `Heart shape?: ${yn(data.heartShape)}`
        ));
      }
      if (typeof data.withPhoto !== "undefined") {
        parts.push(line(
          `Con foto: ${yn(data.withPhoto)}`,
          `With photo: ${yn(data.withPhoto)}`
        ));
      }
      // CAMPO 3 (designImage) –– AÑADIDO
      if (typeof data.designImage !== "undefined") {
        parts.push(line(
          `Con imagen de diseño: ${yn(data.designImage)}`,
          `With design image: ${yn(data.designImage)}`
        ));
      }

      return parts.join("\n");
    }

    function openWhatsAppToBakery(orderNumber, data, lang) {
      const txt = buildOrderSummaryText(orderNumber, data, lang);
      const url = `https://wa.me/${MANOLOS_WHATSAPP_E164_NO_PLUS}?text=${encodeURIComponent(txt)}`;
      window.open(url, "_blank");
    }

    function openSmsToBakery(orderNumber, data, lang) {
      const txt = buildOrderSummaryText(orderNumber, data, lang);
      const url = `sms:${MANOLOS_PHONE_E164_PLUS}?&body=${encodeURIComponent(txt)}`;
      window.location.href = url;
    }

    function callBakery() {
      const url = `tel:${MANOLOS_PHONE_E164_PLUS}`;
      window.location.href = url;
    }

    function getContactMethodValue(val) {
      if (Array.isArray(val)) return val[0];
      return val || "";
    }

    let tempOrderData = {}; // To store form data temporarily for modal confirmation

    // --- Language Content ---
    const translations = {
        es: {
            bakeryPageTitle: "Manolo's Bakery - Formulario de Pedido",
            customerInfoTitle: "Información del Cliente",
            customerNameLabel: "Nombre del Cliente:",
            phoneLabel: "Teléfono:",
            emailLabel: "Correo Electrónico:",
            deliveryMethodLabel: "¿Cómo deseas recibirlo?",
            deliveryMethodPickup: "Recoger en la pastelería",
            deliveryMethodHome: "Domicilio",
            orderDateLabel: "Fecha de Pedido:",
            deliveryDateLabel: "Fecha de Entrega (MM/DD/AAAA):",
            deliveryTimeLabel: "Hora de Entrega/Recogida:",
            selectTimeOptionDefault: "-- Selecciona un Horario --",
            contactPreferenceLabel: "¿Cómo prefieres ser contactado?",
            whatsappLabel: "WhatsApp",
            emailContactLabel: "Correo Electrónico",
            smsLabel: "SMS",
            phoneCallLabel: "Llamada Telefónica",
            showcaseCakeTab: "Pastel de Vitrina",
            customCakeTab: "Pastel Personalizado",
            showcaseCakeTitle: "Pasteles de Vitrina",
            selectShowcaseCakeLabel: "Selecciona un Pastel:",
            selectOptionDefault: "-- Selecciona --",
            commentsLabel: "Comentarios o Sugerencias:",
            customCakeTitle: "Pasteles Personalizados",
            customShapeAndSizeLabel: "Forma y Tamaño:",
            customCakeTypeLabel: "Tipo de Pastel:",
            selectTypeOptionDefault: "-- Selecciona Tipo --",
            cakeTypeTresLechesVanilla: "Tres Leches / Vainilla",
            cakeTypeTresLechesChocolate: "Tres Leches / Chocolate",
            cakeTypeVanillaDry: "Vainilla Seco",
            cakeTypeChocolateDry: "Chocolate Seco",
            cakeTypeMarble: "Marmolado",
            cakeTypeMocha: "Mocca",
            cakeTypePassionFruit: "Maracuyá",
            cakeTypeOther: "Otro",
            customOtherCakeTypeLabel: "Especifica otro tipo de pastel:",
            customOtherCakeTypeRequiredError: "Por favor, especifica el tipo de pastel si seleccionas 'Otro'.",
            customDecorationDetailsLabel: "Detalles de Decoración:",
            decTopClosuresLabel: "Con cierres arriba",
            decTopClosuresToneLabel: "Tono de cierre arriba:",
            decBottomClosuresLabel: "Con cierres abajo",
            decBottomClosuresToneLabel: "Tono de cierre abajo:",
            decRosettesLabel: "Con rosetones",
            decRosettesToneLabel: "Tono de Rosetones:",
            selectToneOptionDefault: "-- Selecciona Tono --",
            toneLight: "Claro",
            toneDark: "Oscuro",
            specifyColorLabel: "Especificar color:",
            customCakeMessageLabel: "Mensaje en el pastel:",
            messageLocationLabel: "Ubicación del mensaje:",
            messageLocationWall: "Pared",
            messageLocationTop: "Tapa",
            messageColorLabel: "Color de letra:",
            messageFontLabel: "Tipo de letra:",
            selectFontOptionDefault: "-- Selecciona Tipo --",
            fontCursive: "Cursiva",
            fontNormal: "Normal",
            customDominantColorsLabel: "Colores predominantes (Ej: Azul primario, tonos pastel claros, rojo oscuro.):",
            customFillingsLabel: "Rellenos: (Selecciona al menos 1)",
            fillingPeach: "Durazno",
            fillingWalnut: "Nuez",
            fillingChocolateChips: "Chocolate Chips",
            fillingMocha: "Mocca",
            fillingCherry: "Cereza",
            fillingStrawberryNatural: "Fresa Natural",
            fillingStrawberryJam: "Fresa Mermelada",
            fillingChocolateDry: "Chocolate Seco",
            fillingPineappleJam: "Piña Mermelada",
            fillingCaramel: "Caramelo",
            selectedFillingsTextPlaceholder: "Seleccionados: Ninguno",
            selectedFillingsTextPrefix: "Seleccionados: ",
            customFillingArrangementLabel: "¿Cómo deseas los rellenos?",
            fillingArrangementMixed: "Mixeado",
            fillingArrangementHalfHalf: "Mitad y Mitad",
            customHalf1FillingsLabel: "Rellenos Mitad 1:",
            customHalf2FillingsLabel: "Rellenos Mitad 2:",
            minThreeFillingsError: "Por favor, selecciona al menos 3 rellenos.",
            fillingArrangementRequiredError: "Por favor, especifica cómo deseas los rellenos.",
            halfSpecificationRequiredError: "Por favor, especifica los rellenos para ambas mitades.",
            previewTitle: "Revisa Tu Pedido",
            confirmOrderBtn: "Confirmar Pedido",
            cancelPreviewBtn: "Cancelar",
            churrosTresLechesCake: "Pastel Churros Tres Leches",
            nutellaTresLechesCake: "Pastel de Nutella Tres Leches",
            plainTresLechesCake: "Pastel Plain Tres Leches",
            carameloTresLechesCake: "Pastel Caramelo Tres Leches",
            peachDarkChocolateTresLechesCake: "Pastel Melocotón Chocolate Oscuro Tres Leches",
            peachWhiteChocolateTresLechesCake: "Pastel Melocotón Chocolate Blanco Tres Leches",
            cheerwineTresLechesCake: "Pastel Cheerwine Tres Leches",
            pecanTresLechesCake: "Pastel Nuez Tres Leches",
            chocolateTresLechesCake: "Pastel Chocolate Tres Leches",
            mocaCake: "Pastel Moca",
            redVelvetCake: "Pastel Red Velvet",
            passionFruitCake: "Pastel Maracuya",
            chileanCake10Inch: 'Pastel Torta Chilena (solo 10")',
            loveCake10Inch: 'Pastel Amor (solo 10")',
            oreoCheesecake10Inch: 'Cheesecake Oreo (solo 10")',
            strawberryCheesecake10Inch: 'Cheesecake Fresa (solo 10")',
            caramelCheesecake10Inch: 'Cheesecake Caramelo (solo 10")',
            plainCheesecake10Inch: 'Cheesecake (solo 10")',
            flan10Inch: 'Flan (solo 10")',
            chocoflan10Inch: 'Chocoflan (solo 10")',
            tiramisu10Inch: 'Tiramisu (solo 10")',
            lemonPie10Inch: 'Lemon Pie (solo 10")',
            pandebonoCake10Inch: 'Pandebono Cake (solo 10")',
            veganGlutenFreeBrownie: 'Brownie Sin Gluten Vegano (solo 7" y 9.5")',
            cakeSizeLabel: "Tamaño:",
            selectSizeOptionDefault: "-- Selecciona Tamaño --",
            size6Inch: '6"',
            size8Inch: '8"',
            size10Inch: '10"',
            circular6Inch: 'Circular 6"',
            circular8Inch: 'Circular 8"',
            circular10Inch: 'Circular 10"',
            squareQuarterSheet: 'Cuadrado 1/4 Sheet',
            rectangularHalfSheet: 'Rectangular 1/2 Sheet',
            customLayersLabel: "Capas del pastel:",
            referenceImageLabel: "Imagen de Referencia (opcional):",
            customCakeNotice: "Los pasteles personalizados requieren al menos 12 horas de anticipación.",
            submitButton: "Enviar Pedido",
            footerText: "Pastelería Premium Delights &copy; 2023",
            deliveryTimeError: "La hora de entrega debe ser entre 9 AM y 9 PM.",
            deliveryDateError: "La fecha de entrega no puede ser en el pasado.",
            customCakeAdvanceNoticeError: "Los pasteles personalizados deben pedirse con al menos 12 horas de anticipación.",
            fillRequiredFieldsError: "Por favor, completa todos los campos obligatorios.",
            selectShowcaseCakeError: "Por favor, selecciona un pastel de vitrina.",
            customCakeDetailsError: "Por favor, selecciona la forma y el tamaño del pastel personalizado.",
            footerTextManolos: "Manolo's Bakery &copy; 2025",
            heartShapeLabel: "¿Forma de corazón?",
            selectHeartPlaceholder: "Selecciona una opción",
            withPhotoLabel: "Con foto:",
            selectPhotoPlaceholder: "Selecciona una opción",
            designImageLabel: "Con imagen de diseño:",
            selectDesignPlaceholder: "Selecciona una opción",
            customerNameEmpleado: "Orden hecha por:",
            sizeSheetInch: "Sheet (Plancha Completa):"
        },
        en: {
            bakeryPageTitle: "Manolo's Bakery - Order Form",
            customerInfoTitle: "Customer Information",
            customerNameLabel: "Customer Name:",
            phoneLabel: "Phone:",
            emailLabel: "Email:",
            deliveryMethodLabel: "How do you want to receive it?",
            deliveryMethodPickup: "Pick up at bakery",
            deliveryMethodHome: "Home delivery",
            orderDateLabel: "Order Date:",
            deliveryDateLabel: "Delivery Date (MM/DD/YYYY):",
            deliveryTimeLabel: "Delivery/Pickup Time:",
            selectTimeOptionDefault: "-- Select a Time Slot --",
            contactPreferenceLabel: "How do you prefer to be contacted?",
            whatsappLabel: "WhatsApp",
            emailContactLabel: "Email",
            smsLabel: "SMS",
            phoneCallLabel: "Phone Call",
            showcaseCakeTab: "Showcase Cake",
            customCakeTab: "Custom Cake",
            showcaseCakeTitle: "Showcase Cakes",
            selectShowcaseCakeLabel: "Select a Cake:",
            selectOptionDefault: "-- Select --",
            commentsLabel: "Comments or Suggestions:",
            customCakeTitle: "Custom Cakes",
            customShapeAndSizeLabel: "Shape and Size:",
            customCakeTypeLabel: "Cake Type:",
            selectTypeOptionDefault: "-- Select Type --",
            cakeTypeTresLechesVanilla: "Tres Leches / Vanilla",
            cakeTypeTresLechesChocolate: "Tres Leches / Chocolate",
            cakeTypeVanillaDry: "Vanilla Dry",
            cakeTypeChocolateDry: "Chocolate Dry",
            cakeTypeMarble: "Marble",
            cakeTypeMocha: "Mocha",
            cakeTypePassionFruit: "Passion Fruit",
            cakeTypeOther: "Other",
            customOtherCakeTypeLabel: "Please specify other cake type:",
            customOtherCakeTypeRequiredError: "Please specify the cake type if you select 'Other'.",
            customDecorationDetailsLabel: "Decoration Details:",
            decTopClosuresLabel: "With top closures",
            decTopClosuresToneLabel: "Top closure tone:",
            decBottomClosuresLabel: "With bottom closures",
            decBottomClosuresToneLabel: "Bottom closure tone:",
            decRosettesLabel: "With rosettes",
            decRosettesToneLabel: "Rosettes tone:",
            selectToneOptionDefault: "-- Select Tone --",
            toneLight: "Light",
            toneDark: "Dark",
            specifyColorLabel: "Specify color:",
            customCakeMessageLabel: "Message on the cake:",
            messageLocationLabel: "Message location:",
            messageLocationWall: "Wall",
            messageLocationTop: "Top",
            messageColorLabel: "Letter color:",
            messageFontLabel: "Font type:",
            selectFontOptionDefault: "-- Select Type --",
            fontCursive: "Cursive",
            fontNormal: "Normal",
            customDominantColorsLabel: "Dominant colors (Ex: Primary blue, light pastel tones, dark red.):",
            customFillingsLabel: "Fillings: (Select at least 1)",
            fillingPeach: "Peach",
            fillingWalnut: "Walnut",
            fillingChocolateChips: "Chocolate Chips",
            fillingMocha: "Mocha",
            fillingCherry: "Cherry",
            fillingStrawberryNatural: "Natural Strawberry",
            fillingStrawberryJam: "Strawberry Jam",
            fillingChocolateDry: "Dry Chocolate",
            fillingPineappleJam: "Pineapple Jam",
            fillingCaramel: "Caramel",
            selectedFillingsTextPlaceholder: "Selected: None",
            selectedFillingsTextPrefix: "Selected: ",
            customFillingArrangementLabel: "How do you want the fillings?",
            fillingArrangementMixed: "Mixed",
            fillingArrangementHalfHalf: "Half and Half",
            customHalf1FillingsLabel: "Fillings Half 1:",
            customHalf2FillingsLabel: "Fillings Half 2:",
            minThreeFillingsError: "Please select at least 3 fillings.",
            fillingArrangementRequiredError: "Please specify how you want the fillings.",
            halfSpecificationRequiredError: "Please specify the fillings for both halves.",
            previewTitle: "Review Your Order",
            confirmOrderBtn: "Confirm Order",
            cancelPreviewBtn: "Cancel",
            churrosTresLechesCake: "Churros Tres Leches Cake",
            nutellaTresLechesCake: "Nutella Tres Leches Cake",
            plainTresLechesCake: "Plain Tres Leches Cake",
            carameloTresLechesCake: "Caramel Tres Leches Cake",
            peachDarkChocolateTresLechesCake: "Peach Dark Chocolate Tres Leches Cake",
            peachWhiteChocolateTresLechesCake: "Peach White Chocolate Tres Leches Cake",
            cheerwineTresLechesCake: "Cheerwine Tres Leches Cake",
            pecanTresLechesCake: "Pecan Tres Leches Cake",
            chocolateTresLechesCake: "Chocolate Tres Leches Cake",
            mocaCake: "Mocha Cake",
            redVelvetCake: "Red Velvet Cake",
            passionFruitCake: "Passion Fruit Cake",
            chileanCake10Inch: 'Chilean Cake (10" only)',
            loveCake10Inch: 'Love Cake (10" only)',
            oreoCheesecake10Inch: 'Oreo Cheesecake (10" only)',
            strawberryCheesecake10Inch: 'Strawberry Cheesecake (10" only)',
            caramelCheesecake10Inch: 'Caramel Cheesecake (10" only)',
            plainCheesecake10Inch: 'Cheesecake (10" only)',
            flan10Inch: 'Flan (10" only)',
            chocoflan10Inch: 'Chocoflan (10" only)',
            tiramisu10Inch: 'Tiramisu (10" only)',
            lemonPie10Inch: 'Lemon Pie (10" only)',
            pandebonoCake10Inch: 'Pandebono Cake (10" only)',
            veganGlutenFreeBrownie: 'Vegan Gluten-Free Brownie (7" & 9.5" only)',
            cakeSizeLabel: "Size:",
            selectSizeOptionDefault: "-- Select Size --",
            size6Inch: '6"',
            size8Inch: '8"',
            size10Inch: '10"',
            circular6Inch: 'Circular 6"',
            circular8Inch: 'Circular 8"',
            circular10Inch: 'Circular 10"',
            squareQuarterSheet: 'Square 1/4 Sheet',
            rectangularHalfSheet: 'Rectangular 1/2 Sheet',
            customLayersLabel: "Cake layers:",
            referenceImageLabel: "Reference Image (optional):",
            customCakeNotice: "Custom cakes require at least 12 hours advance notice.",
            submitButton: "Submit Order",
            footerText: "Premium Delights Bakery &copy; 2023",
            deliveryTimeError: "Delivery time must be between 9 AM and 9 PM.",
            deliveryDateError: "Delivery date cannot be in the past.",
            customCakeAdvanceNoticeError: "Custom cakes must be ordered at least 12 hours in advance.",
            fillRequiredFieldsError: "Please fill in all required fields.",
            selectShowcaseCakeError: "Please select a showcase cake.",
            customCakeDetailsError: "Please select the shape and size for the custom cake.",
            footerTextManolos: "Manolo's Bakery &copy; 2025",
            heartShapeLabel: "Heart shape?",
            selectHeartPlaceholder: "Select an option",
            optionYes: "Yes",
            optionNo: "No",
            withPhotoLabel: "With photo:",
            selectPhotoPlaceholder: "Select an option",
            designImageLabel: "With design image:",
            selectDesignPlaceholder: "Select an option",
            customerNameEmpleado: "Order taken by:",
            sizeSheetInch: "Sheet (Complete Plank):"
        }
    };

    // Helper to extract fixed size from cake option text
    function getFixedSizeFromOption(selectedOption) {
        if (!selectedOption || !selectedOption.text) return null;
        var attr = selectedOption.getAttribute('data-fixed-size');
        if (attr) return attr;
        const text = selectedOption.text.toLowerCase();
        if (text.includes('(solo 10")') || text.includes('(10" only)')) return "10";
        if (text.includes('(solo 7" y 9.5")') || text.includes('(7" & 9.5" only)')) return "7_9.5";
        return null;
    }

    // --- Event Listener for Showcase Cake Selection Change ---
    if (showcaseCakeSelect && showcaseCakeSizeSelect) {
        showcaseCakeSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const fixedSize = getFixedSizeFromOption(selectedOption);

            if (fixedSize) {
                if (["6", "8", "10"].includes(fixedSize)) {
                    showcaseCakeSizeSelect.value = fixedSize;
                    showcaseCakeSizeSelect.disabled = true;
                    showcaseCakeSizeSelect.required = false;
                } else if (fixedSize === "7_9.5") {
                    showcaseCakeSizeSelect.value = "";
                    showcaseCakeSizeSelect.disabled = true;
                    showcaseCakeSizeSelect.required = false;
                } else {
                    showcaseCakeSizeSelect.value = "";
                    showcaseCakeSizeSelect.disabled = true;
                    showcaseCakeSizeSelect.required = false;
                }
            } else {
                showcaseCakeSizeSelect.disabled = false;
                showcaseCakeSizeSelect.required = true;
            }
        });
    }

    // --- Event Listener for Custom Cake Type Selection Change ---
    if (customCakeTypeSelect && otherCakeTypeGroup && otherCakeTypeInput) {
        customCakeTypeSelect.addEventListener('change', function() {
            if (this.value === 'otro') {
                otherCakeTypeGroup.style.display = 'block';
                otherCakeTypeInput.required = true;
            } else {
                otherCakeTypeGroup.style.display = 'none';
                otherCakeTypeInput.required = false;
                otherCakeTypeInput.value = '';
            }
        });
    }

    // --- Logic for Fillings Selection ---
    let updateSelectedFillingsDisplay = null; // hoist para usar en translatePage

    if (fillingsCheckboxesContainer) {
        const checkboxes = fillingsCheckboxesContainer.querySelectorAll('input[type="checkbox"]');

        updateSelectedFillingsDisplay = function () {
            const selected = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => {
                    const label = document.querySelector(`label[for="${cb.id}"]`);
                    return label ? label.textContent : cb.value;
                });

            if (selectedFillingsDisplay) {
                if (selected.length > 0) {
                    selectedFillingsDisplay.textContent = translations[currentLang].selectedFillingsTextPrefix + selected.join(', ');
                } else {
                    selectedFillingsDisplay.textContent = translations[currentLang].selectedFillingsTextPlaceholder;
                }
            }
            return selected.length;
        };

        function handleFillingSelectionChange() {
            const selectedCount = updateSelectedFillingsDisplay();

            if (selectedCount === 2) {
                if (fillingArrangementGroup) fillingArrangementGroup.style.display = 'block';
                fillingArrangementRadios.forEach(radio => radio.required = false);
            } else {
                if (fillingArrangementGroup) fillingArrangementGroup.style.display = 'none';
                fillingArrangementRadios.forEach(radio => {
                    radio.required = false;
                    radio.checked = false;
                });

                if (halfAndHalfSpecificationGroup) halfAndHalfSpecificationGroup.style.display = 'none';
                if (half1FillingsInput) {
                    half1FillingsInput.required = false;
                    half1FillingsInput.value = '';
                }
                if (half2FillingsInput) {
                    half2FillingsInput.required = false;
                    half2FillingsInput.value = '';
                }
            }
        }

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleFillingSelectionChange);
        });

        // Manejo de radios
        fillingArrangementRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'mitad_mitad' && this.checked) {
                    if (halfAndHalfSpecificationGroup) halfAndHalfSpecificationGroup.style.display = 'block';
                    if (half1FillingsInput) half1FillingsInput.required = true;
                    if (half2FillingsInput) half2FillingsInput.required = true;
                } else {
                    if (halfAndHalfSpecificationGroup) halfAndHalfSpecificationGroup.style.display = 'none';
                    if (half1FillingsInput) {
                        half1FillingsInput.required = false;
                        half1FillingsInput.value = '';
                    }
                    if (half2FillingsInput) {
                        half2FillingsInput.required = false;
                        half2FillingsInput.value = '';
                    }
                }
            });
        });
    }

    // --- Logic for Decoration Options ---
    function handleDecorationCheckboxChange(checkbox, toneGroup, colorSpecGroup, toneSelect, colorSpecInput) {
        if (checkbox && toneGroup && toneSelect) {
            if (checkbox.checked) {
                toneGroup.style.display = 'block';
            } else {
                toneGroup.style.display = 'none';
                toneSelect.required = false;
                toneSelect.value = '';
                if (colorSpecGroup && colorSpecInput) {
                    colorSpecGroup.style.display = 'none';
                    colorSpecInput.required = false;
                    colorSpecInput.value = '';
                }
            }
        }
    }

    function handleToneSelectChange(toneSelect, colorSpecGroup, colorSpecInput) {
        if (toneSelect && colorSpecGroup && colorSpecInput) {
            if (toneSelect.value) {
                colorSpecGroup.style.display = 'block';
                colorSpecInput.required = true;
            } else {
                colorSpecGroup.style.display = 'none';
                colorSpecInput.required = false;
                colorSpecInput.value = '';
            }
        }
    }

    if (decTopClosuresCheckbox) {
        decTopClosuresCheckbox.addEventListener('change', function() {
            handleDecorationCheckboxChange(this, decTopClosuresToneGroup, decTopClosuresColorSpecGroup, decTopClosuresToneSelect, decTopClosuresColorSpecInput);
        });
    }
    if (decBottomClosuresCheckbox) {
        decBottomClosuresCheckbox.addEventListener('change', function() {
            handleDecorationCheckboxChange(this, decBottomClosuresToneGroup, decBottomClosuresColorSpecGroup, decBottomClosuresToneSelect, decBottomClosuresColorSpecInput);
        });
    }
    if (decRosettesCheckbox) {
        decRosettesCheckbox.addEventListener('change', function() {
            handleDecorationCheckboxChange(this, decRosettesToneGroup, decRosettesColorSpecGroup, decRosettesToneSelect, decRosettesColorSpecInput);
        });
    }

    if (decTopClosuresToneSelect) {
        decTopClosuresToneSelect.addEventListener('change', function() {
            handleToneSelectChange(this, decTopClosuresColorSpecGroup, decTopClosuresColorSpecInput);
        });
    }
    if (decBottomClosuresToneSelect) {
        decBottomClosuresToneSelect.addEventListener('change', function() {
            handleToneSelectChange(this, decBottomClosuresColorSpecGroup, decBottomClosuresColorSpecInput);
        });
    }
    if (decRosettesToneSelect) {
        decRosettesToneSelect.addEventListener('change', function() {
            handleToneSelectChange(this, decRosettesColorSpecGroup, decRosettesColorSpecInput);
        });
    }

    // --- Logic for Message Options ---
    if (cakeMessageTextarea) {
        cakeMessageTextarea.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                if (messageOptionsGroup) messageOptionsGroup.style.display = 'block';
                messageLocationRadios.forEach(radio => radio.required = true);
                if (messageColorSelect) messageColorSelect.required = true;
                if (messageFontSelect) messageFontSelect.required = true;
            } else {
                if (messageOptionsGroup) messageOptionsGroup.style.display = 'none';
                messageLocationRadios.forEach(radio => {
                    radio.required = false;
                    radio.checked = false;
                });
                if (messageColorSelect) {
                    messageColorSelect.required = false;
                    messageColorSelect.value = '';
                }
                if (messageFontSelect) {
                    messageFontSelect.required = false;
                    messageFontSelect.value = '';
                }
            }
        });
    }

    let currentLang = 'es'; // Default language

    function translatePage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.placeholder && el.id !== 'cc-flavor') {
                        el.placeholder = translations[lang][key];
                    }
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
        const submitInput = document.querySelector('button[type="submit"][data-translate="submitButton"]');
        if (submitInput) {
            submitInput.textContent = translations[lang].submitButton;
        }

        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        if (fillingsCheckboxesContainer && typeof updateSelectedFillingsDisplay === 'function') {
            updateSelectedFillingsDisplay();
        }
    }

    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            translatePage(e.target.dataset.lang);
        });
    });

    // --- Tabbed Interface for Cake Sections ---
    window.openCakeSection = function(event, sectionName) {
        const cakeSections = document.querySelectorAll('.cake-section');
        cakeSections.forEach(section => section.style.display = 'none');

        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => button.classList.remove('active'));

        document.getElementById(sectionName).style.display = 'block';
        event.currentTarget.classList.add('active');
        cakeTypeHiddenInput.value = sectionName;

        if (sectionName === 'custom') {
            if (customCakeSizeSelect) customCakeSizeSelect.required = true;
            if (customCakeTypeSelect) customCakeTypeSelect.required = true;
            if (customCakeTypeSelect && customCakeTypeSelect.value === 'otro' && otherCakeTypeInput) {
                otherCakeTypeInput.required = true;
                if(otherCakeTypeGroup) otherCakeTypeGroup.style.display = 'block';
            } else if (otherCakeTypeInput) {
                otherCakeTypeInput.required = false;
                if(otherCakeTypeGroup) otherCakeTypeGroup.style.display = 'none';
            }

            if (fillingsCheckboxesContainer && typeof updateSelectedFillingsDisplay === 'function') {
                updateSelectedFillingsDisplay();
            }

            if (showcaseCakeSelect) showcaseCakeSelect.required = false;
            if (showcaseCakeSizeSelect) showcaseCakeSizeSelect.required = false;
            if (document.getElementById('cc-flavor')) document.getElementById('cc-flavor').required = true;
            if (document.getElementById('heart-shape')) document.getElementById('heart-shape').required = true;
            if (document.getElementById('with-photo')) document.getElementById('with-photo').required = true;
            if (document.getElementById('design-image')) document.getElementById('design-image').required = true;
        } else { // showcase
            if (customCakeSizeSelect) customCakeSizeSelect.required = false;
            if (customCakeTypeSelect) customCakeTypeSelect.required = false;
            if (otherCakeTypeInput) {
                otherCakeTypeInput.required = false;
                if(otherCakeTypeGroup) otherCakeTypeGroup.style.display = 'none';
                otherCakeTypeInput.value = '';
            }
            if (fillingsCheckboxesContainer) {
                fillingsCheckboxesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                if (typeof updateSelectedFillingsDisplay === 'function') updateSelectedFillingsDisplay();
                if (fillingArrangementGroup) fillingArrangementGroup.style.display = 'none';
                fillingArrangementRadios.forEach(radio => {
                    radio.checked = false;
                    radio.required = false;
                });
                if (halfAndHalfSpecificationGroup) halfAndHalfSpecificationGroup.style.display = 'none';
                if (half1FillingsInput) {
                    half1FillingsInput.value = '';
                    half1FillingsInput.required = false;
                }
                if (half2FillingsInput) {
                    half2FillingsInput.value = '';
                    half2FillingsInput.required = false;
                }
            }

            if (document.getElementById('cc-flavor')) document.getElementById('cc-flavor').required = false;
            if (document.getElementById('heart-shape')) document.getElementById('heart-shape').required = false;
            if (document.getElementById('with-photo')) document.getElementById('with-photo').required = false;
            if (document.getElementById('design-image')) document.getElementById('design-image').required = false;

            if (showcaseCakeSelect) showcaseCakeSelect.required = true;
            if (showcaseCakeSizeSelect) {
                const selectedShowcaseCakeOption = showcaseCakeSelect.options[showcaseCakeSelect.selectedIndex];
                if (getFixedSizeFromOption(selectedShowcaseCakeOption)) {
                    showcaseCakeSizeSelect.required = false;
                    showcaseCakeSizeSelect.disabled = true;
                    const fixedSizeVal = getFixedSizeFromOption(selectedShowcaseCakeOption);
                    if (["6", "8", "10"].includes(fixedSizeVal)) {
                        showcaseCakeSizeSelect.value = fixedSizeVal;
                    } else {
                        showcaseCakeSizeSelect.value = "";
                    }
                } else {
                    showcaseCakeSizeSelect.required = true;
                    showcaseCakeSizeSelect.disabled = false;
                }
            }
        }
    };

    // --- Date Handling ---
    function getCurrentDateFormatted() {
        const today = new Date();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const year = today.getFullYear();
        return `${month}/${day}/${year}`;
    }

    if (orderDateInput) {
        orderDateInput.value = getCurrentDateFormatted();
    }

    // --- Form Validation ---
    // La API recibe una hora inequívoca de 12 horas (ej.: "03:30 PM").
    // El campo oculto conserva el nombre deliveryTime usado por el resto del flujo.
    // El input type="time" siempre guarda su valor en formato 24h (HH:mm), sin importar
    // cómo lo muestre el navegador, así que el AM/PM se calcula solo, sin pedirlo aparte.
    const deliveryTimeInput = document.getElementById('deliveryTimeInput');
    const deliveryTimeHidden = document.getElementById('deliveryTime');

    function syncDeliveryTime() {
        if (!deliveryTimeInput || !deliveryTimeHidden) return '';
        if (!deliveryTimeInput.value) {
            deliveryTimeHidden.value = '';
            return '';
        }
        const parts = deliveryTimeInput.value.split(':');
        let hour = Number(parts[0]);
        const minute = parts[1];
        const meridiem = hour >= 12 ? 'PM' : 'AM';
        // El input de tipo time entrega 00-23. Convertimos a 12 horas sin ambigüedad.
        hour = hour % 12;
        if (hour === 0) hour = 12;
        deliveryTimeHidden.value = String(hour).padStart(2, '0') + ':' + minute + ' ' + meridiem;
        return deliveryTimeHidden.value;
    }

    if (deliveryTimeInput) deliveryTimeInput.addEventListener('input', syncDeliveryTime);

    function getDeliveryHour24_() {
        const value = syncDeliveryTime();
        const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value);
        if (!match) return null;
        let hour = Number(match[1]) % 12;
        if (match[3].toUpperCase() === 'PM') hour += 12;
        return { hour: hour, minute: Number(match[2]) };
    }

    function validateForm() {
        syncDeliveryTime();
        const requiredInputs = orderForm.querySelectorAll('[required]');
        for (let input of requiredInputs) {
            if (!input.value || !String(input.value).trim()) {
                showNotice(translations[currentLang].fillRequiredFieldsError + ` (${(input.labels && input.labels[0] ? input.labels[0].textContent.replace(':','') : input.name)} )`, 'error');
                input.focus();
                return false;
            }
        }

        if (deliveryDateInput.value) {
            const deliveryDateParts = deliveryDateInput.value.split('/');
            if (deliveryDateParts.length === 3) {
                const month = parseInt(deliveryDateParts[0]) - 1;
                const day = parseInt(deliveryDateParts[1]);
                const year = parseInt(deliveryDateParts[2]);
                const deliveryDate = new Date(year, month, day);
                const today = new Date();
                today.setHours(0,0,0,0);

                if (deliveryDate < today) {
                    showNotice(translations[currentLang].deliveryDateError, 'error');
                    deliveryDateInput.focus();
                    return false;
                }

                if (cakeTypeHiddenInput.value === 'custom') {
                    const orderDateTime = new Date();
                    const selectedTime = getDeliveryHour24_() || { hour: 9, minute: 0 };
                    const deliveryDateTime = new Date(deliveryDateParts[2], deliveryDateParts[0] - 1, deliveryDateParts[1], selectedTime.hour, selectedTime.minute, 0);
                    const diffHours = (deliveryDateTime - orderDateTime) / (1000 * 60 * 60);
                    if (diffHours < 12) {
                        showNotice(translations[currentLang].customCakeAdvanceNoticeError, 'error');
                        deliveryDateInput.focus();
                        return false;
                    }
                }
            } else {
                showNotice(translations[currentLang].deliveryDateLabel.split('(')[0].trim() + ' format is invalid.', 'error');
                deliveryDateInput.focus();
                return false;
            }
        }

        // Mantiene el mismo horario comercial que tenían las franjas anteriores: 9 AM a 9 PM.
        const selectedDeliveryTime = getDeliveryHour24_();
        if (!selectedDeliveryTime || selectedDeliveryTime.hour < 9 || selectedDeliveryTime.hour > 21 ||
            (selectedDeliveryTime.hour === 21 && selectedDeliveryTime.minute > 0)) {
            showNotice(translations[currentLang].deliveryTimeError, 'error');
            if (deliveryTimeInput) deliveryTimeInput.focus();
            return false;
        }

        if (cakeTypeHiddenInput.value === 'showcase') {
            if (!showcaseCakeSelect.value) {
                showNotice(translations[currentLang].selectShowcaseCakeError, 'error');
                showcaseCakeSelect.focus();
                return false;
            }
            if (showcaseCakeSizeSelect && !showcaseCakeSizeSelect.disabled && showcaseCakeSizeSelect.required && !showcaseCakeSizeSelect.value) {
                showNotice(translations[currentLang].cakeSizeLabel.replace(':','') + " " + translations[currentLang].fillRequiredFieldsError.toLowerCase().split(" ")[3] + ".", 'error');
                showcaseCakeSizeSelect.focus();
                return false;
            }

            var scCakeMsg = document.getElementById('sc-cakeMessage');
            if (scCakeMsg && scCakeMsg.value.trim()) {
                var scLocChecked = document.querySelector('input[name="sc-messageLocation"]:checked');
                if (!scLocChecked) {
                    showNotice(translations[currentLang].fillRequiredFieldsError + ' (' + translations[currentLang].messageLocationLabel.replace(':','') + ')', 'error');
                    return false;
                }
                var scMsgColor = document.getElementById('sc-message-color');
                if (scMsgColor && !scMsgColor.value) {
                    showNotice(translations[currentLang].fillRequiredFieldsError + ' (' + translations[currentLang].messageColorLabel.replace(':','') + ')', 'error');
                    scMsgColor.focus();
                    return false;
                }
                var scMsgFont = document.getElementById('sc-message-font');
                if (scMsgFont && !scMsgFont.value) {
                    showNotice(translations[currentLang].fillRequiredFieldsError + ' (' + translations[currentLang].messageFontLabel.replace(':','') + ')', 'error');
                    scMsgFont.focus();
                    return false;
                }
            }
        } else if (cakeTypeHiddenInput.value === 'custom') {
            if (customCakeSizeSelect && !customCakeSizeSelect.value) {
                showNotice(translations[currentLang].customCakeDetailsError, 'error');
                customCakeSizeSelect.focus();
                return false;
            }
            if (customCakeTypeSelect && !customCakeTypeSelect.value) {
                showNotice(translations[currentLang].fillRequiredFieldsError + ` (${customCakeTypeSelect.labels[0].textContent.replace(':','')} )`, 'error');
                customCakeTypeSelect.focus();
                return false;
            }
            if (customCakeTypeSelect && customCakeTypeSelect.value === 'otro' && otherCakeTypeInput && !otherCakeTypeInput.value.trim()) {
                showNotice(translations[currentLang].customOtherCakeTypeRequiredError, 'error');
                otherCakeTypeInput.focus();
                return false;
            }

            var layersEl = document.getElementById('cc-flavor');
            if (layersEl && !layersEl.value) {
                showNotice(translations[currentLang].fillRequiredFieldsError + ' (' + (layersEl.labels && layersEl.labels[0] ? layersEl.labels[0].textContent.replace(':','') : 'Capas') + ')', 'error');
                layersEl.focus();
                return false;
            }

            var heartEl = document.getElementById('heart-shape');
            if (heartEl && !heartEl.value) {
                showNotice(translations[currentLang].fillRequiredFieldsError + ' (' + (heartEl.labels && heartEl.labels[0] ? heartEl.labels[0].textContent.replace(':','') : 'Forma de corazón') + ')', 'error');
                heartEl.focus();
                return false;
            }

            var photoEl = document.getElementById('with-photo');
            if (photoEl && !photoEl.value) {
                showNotice(translations[currentLang].fillRequiredFieldsError + ' (' + (photoEl.labels && photoEl.labels[0] ? photoEl.labels[0].textContent.replace(':','') : 'Con foto') + ')', 'error');
                photoEl.focus();
                return false;
            }

            var designEl = document.getElementById('design-image');
            if (designEl && !designEl.value) {
                showNotice(translations[currentLang].fillRequiredFieldsError + ' (' + (designEl.labels && designEl.labels[0] ? designEl.labels[0].textContent.replace(':','') : 'Imagen de diseño') + ')', 'error');
                designEl.focus();
                return false;
            }

            if (fillingsCheckboxesContainer) {
                const selectedFillingsCount = Array.from(fillingsCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked')).length;
                // Tu comentario original decía "al menos 1"; dejamos que pase con 1, solo pedimos distribución si son 2 exactos.
                if (selectedFillingsCount === 2) {
                    const arrangementSelected = Array.from(fillingArrangementRadios).some(radio => radio.checked);
                    if (!arrangementSelected) {
                        showNotice(translations[currentLang].fillingArrangementRequiredError, 'error');
                        if(fillingArrangementRadios.length > 0) fillingArrangementRadios[0].focus();
                        return false;
                    }
                    const halfHalfRadio = document.getElementById('filling-mitad-mitad');
                    if (halfHalfRadio && halfHalfRadio.checked) {
                        if (!half1FillingsInput.value.trim() || !half2FillingsInput.value.trim()) {
                            showNotice(translations[currentLang].halfSpecificationRequiredError, 'error');
                            if (!half1FillingsInput.value.trim()) half1FillingsInput.focus();
                            else half2FillingsInput.focus();
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    // ========= Helpers para construir datos y mostrar preview =========
function buildTempOrderDataFromForm() {
    const formData = new FormData(orderForm);
    const tmp = {};
    const selectedFillings = [];

    if (fillingsCheckboxesContainer) {
        fillingsCheckboxesContainer.querySelectorAll('input[name="customFilling"]:checked').forEach(cb => {
            selectedFillings.push(cb.value);
        });
    }

    formData.forEach((value, key) => {
        if (key === 'contactMethod') {
            tmp[key] = value;
        } else if (key === 'customFilling') {

        } else {
            tmp[key] = value;
        }
    });

    if (selectedFillings.length > 0) {
        tmp.customFillings = selectedFillings;
    }

    tmp.cakeType = cakeTypeHiddenInput.value;

    const arrangementSelected = document.querySelector('input[name="customFillingArrangement"]:checked');

    if (arrangementSelected) {
        if (arrangementSelected.value === "otro") {
            tmp.customFillingArrangement = (otroArrangementInput && otroArrangementInput.value.trim())
                ? otroArrangementInput.value.trim()
                : "Otro (sin especificar)";
        } else {
            tmp.customFillingArrangement = arrangementSelected.value;
        }
    }

    // Adjuntamos imagen si existe
    if (currentImageBase64) {
        tmp.customCakeImageBase64 = currentImageBase64;
    }

    return tmp;
}

    function formatPreviewDetails(data) {
        let detailsHtml = "<table style='width: 100%;'>";

        function addDetailRow(labelKey, value) {
            if (value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0)) {
                const labelText = translations[currentLang][labelKey] || labelKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + ":";
                let displayValue = value;
                if (labelKey === "contactPreferenceLabel") {
                    const label = value + 'Label';
                    displayValue = translations[currentLang][label] || value;
                } else if (labelKey === "deliveryMethodLabel" && value === "pickup") {
                    displayValue = translations[currentLang].deliveryMethodPickup;
                } else if (labelKey === "deliveryMethodLabel" && value === "home") {
                    displayValue = translations[currentLang].deliveryMethodHome;
                }
                detailsHtml += `<tr><td style='padding:4px 0;vertical-align:top;width:40%;'><strong>${labelText}</strong></td><td style='padding:4px 0;vertical-align:top;'>${displayValue}</td></tr>`;
            }
        }

        function rowHTML(label, value) {
            return `<tr><td style='padding:4px 0;vertical-align:top;width:40%;'><strong>${label}</strong></td><td style='padding:4px 0;vertical-align:top;'>${value}</td></tr>`;
        }

        // --- Datos de cliente
        addDetailRow("customerNameLabel", data.customerName);
        addDetailRow("phoneLabel", data.phone);
        addDetailRow("emailLabel", data.email);
        addDetailRow("deliveryMethodLabel", data.deliveryMethod);
        addDetailRow("deliveryDateLabel", data.deliveryDate);
        addDetailRow("deliveryTimeLabel", data.deliveryTime);
        addDetailRow("contactPreferenceLabel", data.contactMethod);

        // NUEVO: Orden hecha por (empleado)
        addDetailRow("customerNameEmpleado", data.customerNameEmpleado);

        // === Campos globales de opciones especiales (DENTRO de formatPreviewDetails) –– AÑADIDO
        (function addGlobalSpecialOptions() {
            function yn(val) {
                if (!val) return "";
                // Mapea yes/no a idioma
                return (val === "yes")
                    ? (translations[currentLang].optionYes || "Sí")
                    : (val === "no")
                        ? (translations[currentLang].optionNo || "No")
                        : val;
            }
            addDetailRow("heartShapeLabel", yn(data.heartShape));
            addDetailRow("withPhotoLabel", yn(data.withPhoto));
            addDetailRow("designImageLabel", yn(data.designImage)); // CAMPO 3 en preview
        })();

        detailsHtml += "</table><hr><h4 style='margin-top:15px;margin-bottom:10px;color:#333;'>Detalles del Pastel:</h4><table style='width:100%;'>";

        if (data.cakeType === "showcase") {
            // Nombre del pastel
            const cakeKey = (data.showcaseCake || "").replace(/_/g, '') + 'Cake';
            addDetailRow("selectShowcaseCakeLabel", translations[currentLang][cakeKey] || data.showcaseCake);

            // Tamaño
            addDetailRow("cakeSizeLabel", data.showcaseCakeSize ? `${data.showcaseCakeSize}"` : "");

            // Comentarios
            addDetailRow("commentsLabel", data.showcaseComments);

            // Mensaje en pastel de vitrina (nuevo en preview)
            if (data.showcaseCakeMessage && data.showcaseCakeMessage.trim() !== "") {
                addDetailRow("customCakeMessageLabel", data.showcaseCakeMessage);

                // Subdetalles: ubicación, color (y especificar), tipografía
                const sub = [];

                const locVal = data['sc-messageLocation'];
                if (locVal) {
                    const locTxt = locVal === 'wall'
                        ? (translations[currentLang].messageLocationWall || 'Pared')
                        : (translations[currentLang].messageLocationTop || 'Tapa');
                    sub.push(`${translations[currentLang].messageLocationLabel || 'Ubicación:'} ${locTxt}`);
                }

                const colorVal = data['sc-messageColor'];
                if (colorVal) {
                    let colorTxt = colorVal === 'claro'
                        ? (translations[currentLang].toneLight || 'Claro')
                        : (translations[currentLang].toneDark || 'Oscuro');
                    const colorSpec = data['sc-messageColorSpec'];
                    if (colorSpec && colorSpec.trim() !== "") colorTxt += `: ${colorSpec}`;
                    sub.push(`${translations[currentLang].messageColorLabel || 'Color:'} ${colorTxt}`);
                }

                const fontVal = data['sc-messageFont'];
                if (fontVal) {
                    const fontTxt = fontVal === 'cursive'
                        ? (translations[currentLang].fontCursive || 'Cursiva')
                        : (translations[currentLang].fontNormal || 'Normal');
                    sub.push(`${translations[currentLang].messageFontLabel || 'Tipo:'} ${fontTxt}`);
                }

                if (sub.length) {
                    detailsHtml += `<tr><td></td><td style='padding:0 0 8px 8px;font-size:.9em;color:#555;'><em>(${sub.join(' &nbsp; | &nbsp; ')})</em></td></tr>`;
                }
            }
        } else if (data.cakeType === "custom") {
            // --- Custom (lo dejamos como lo tenías) ---
            const sizeKey = (data.customCakeSize || "").replace(/_/g, '') + (data.customCakeSize && data.customCakeSize.includes('_') ? '' : 'Inch');
            addDetailRow("customShapeAndSizeLabel", translations[currentLang][sizeKey] || (data.customCakeSize || "").replace('_', ' '));

            const typeKey = 'cakeType' + (data.customCakeType || "").charAt(0).toUpperCase() + (data.customCakeType || "").slice(1).replace(/_([a-z])/g, g => g[1].toUpperCase());
            addDetailRow("customCakeTypeLabel", translations[currentLang][typeKey] || data.customCakeType);

            if (data.customCakeType === 'otro') addDetailRow("customOtherCakeTypeLabel", data.customOtherCakeType);
            addDetailRow("customLayersLabel", data.customCakeFlavor);

            if (data.customFillings && data.customFillings.length > 0) {
                const translatedFillings = data.customFillings.map(f => {
                    const key = 'filling' + f.charAt(0).toUpperCase() + f.slice(1).replace(/_([a-z])/g, g => g[1].toUpperCase());
                    return translations[currentLang][key] || f;
                });
                addDetailRow("customFillingsLabel", translatedFillings.join(', '));
            }

            if (data.customFillingArrangement) {
                const arrKey = data.customFillingArrangement === "mitad_mitad" ? "fillingArrangementHalfHalf" : "fillingArrangementMixed";
                addDetailRow("customFillingArrangementLabel", translations[currentLang][arrKey] || data.customFillingArrangement);
                if (data.customFillingArrangement === "mitad_mitad") {
                    addDetailRow("customHalf1FillingsLabel", data.customHalf1Fillings);
                    addDetailRow("customHalf2FillingsLabel", data.customHalf2Fillings);
                }
            }

            if (data.decTopClosures || data.decBottomClosures || data.decRosettes) {
                detailsHtml += "<tr><td colspan='2' style='padding:10px 0 5px 0;'><strong>" + (translations[currentLang].customDecorationDetailsLabel || "Detalles de Decoración") + ":</strong></td></tr>";
            }
            if (data.decTopClosures) {
                let detail = (data.decTopClosuresTone === "claro" ? translations[currentLang].toneLight : translations[currentLang].toneDark);
                if (data.decTopClosuresColorSpec) detail += `: ${data.decTopClosuresColorSpec}`;
                detailsHtml += rowHTML(translations[currentLang].decTopClosuresLabel || "Con cierres arriba", detail);
            }
            if (data.decBottomClosures) {
                let detail = (data.decBottomClosuresTone === "claro" ? translations[currentLang].toneLight : translations[currentLang].toneDark);
                if (data.decBottomClosuresColorSpec) detail += `: ${data.decBottomClosuresColorSpec}`;
                detailsHtml += rowHTML(translations[currentLang].decBottomClosuresLabel || "Con cierres abajo", detail);
            }
            if (data.decRosettes) {
                let detail = (data.decRosettesTone === "claro" ? translations[currentLang].toneLight : translations[currentLang].toneDark);
                if (data.decRosettesColorSpec) detail += `: ${data.decRosettesColorSpec}`;
                detailsHtml += rowHTML(translations[currentLang].decRosettesLabel || "Con rosetones", detail);
            }

            if (data.customCakeMessage) {
                addDetailRow("customCakeMessageLabel", data.customCakeMessage);
                const msg = [];
                if (data.messageLocation) {
                    msg.push(`${translations[currentLang].messageLocationLabel || 'Ubicación:'} ${data.messageLocation === 'wall' ? (translations[currentLang].messageLocationWall || 'Pared') : (translations[currentLang].messageLocationTop || 'Tapa')}`);
                }
                if (data.messageColor) {
                    let t = data.messageColor === 'claro' ? (translations[currentLang].toneLight || 'Claro') : (translations[currentLang].toneDark || 'Oscuro');
                    if (data.messageColorSpec) t += `: ${data.messageColorSpec}`;
                    msg.push(`${translations[currentLang].messageColorLabel || 'Color:'} ${t}`);
                }
                if (data.messageFont) {
                    msg.push(`${translations[currentLang].messageFontLabel || 'Tipo:'} ${data.messageFont === 'cursive' ? (translations[currentLang].fontCursive || 'Cursiva') : (translations[currentLang].fontNormal || 'Normal')}`);
                }
                if (msg.length) {
                    detailsHtml += `<tr><td></td><td style='padding:0 0 8px 8px;font-size:.9em;color:#555;'><em>(${msg.join(' &nbsp; | &nbsp; ')})</em></td></tr>`;
                }
            }

            if (data.customCakeImageBase64) {
                detailsHtml += `<tr><td style='padding:8px 0;vertical-align:top;'><strong>${translations[currentLang].referenceImageLabel}</strong></td><td style='padding:8px 0;vertical-align:top;'><img src="${data.customCakeImageBase64}" alt="Referencia" style="max-width:220px;height:auto;border-radius:8px;border:1px solid #ddd;padding:3px;"></td></tr>`;
            }

            addDetailRow("customDominantColorsLabel", data.customDominantColors);
            addDetailRow("commentsLabel", data.customComments);
        }

        detailsHtml += "</table>";
        detailsHtml += "<p style='margin-top:15px;font-style:italic;'>Se generará un número de orden al confirmar.</p>";
        return detailsHtml;

        function rowHTML(label, value) {
                return `<tr><td style='padding: 4px 0; vertical-align: top; width: 40%;'><strong>${label}</strong></td><td style='padding: 4px 0; vertical-align: top;'>${value}</td></tr>`;
        }
    }

    function displayOrderPreview(orderData) {
        if (previewOrderDetailsDiv && orderPreviewModal) {
            previewOrderDetailsDiv.innerHTML = formatPreviewDetails(orderData);
            // Mostrar modal con estilo seguro aunque no exista CSS .active
            orderPreviewModal.style.display = 'flex';
            orderPreviewModal.classList.add('active');
            const title = orderPreviewModal.querySelector('h3');
            if (title) title.textContent = translations[currentLang].previewTitle;
            if (previewConfirmOrderBtn) previewConfirmOrderBtn.textContent = translations[currentLang].confirmOrderBtn;
            if (cancelPreviewBtn) cancelPreviewBtn.textContent = translations[currentLang].cancelPreviewBtn;
        }
    }

    function closeOrderPreview() {
        if (orderPreviewModal) {
            orderPreviewModal.classList.remove('active');
            orderPreviewModal.style.display = 'none';
        }
        const mainSubmitButton = document.getElementById('submitOrderBtn');
        if (mainSubmitButton) mainSubmitButton.disabled = false;
    }

    if (cancelPreviewBtn) {
        cancelPreviewBtn.addEventListener('click', closeOrderPreview);
    }

    if (orderPreviewModal) {
        orderPreviewModal.addEventListener('click', function(event) {
            if (event.target === orderPreviewModal) {
                closeOrderPreview();
            }
        });
    }

    // ======== Primer listener de SUBMIT (tuyo). Lo redirigimos a PREVIEW ========
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const btn = document.getElementById('submitOrderBtn');
            const originalButtonText = btn ? btn.textContent : '';

            if (!validateForm()) {
                if (btn) btn.disabled = false;
                return;
            }

            // Si usamos el flujo de previsualización, NO mandamos aquí.
            if (window.__USE_PREVIEW_FLOW__ === true) {
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = 'Generando resumen...';
                }

                // Construimos tempOrderData y mostramos el modal
                tempOrderData = buildTempOrderDataFromForm();
                let previewData = { ...tempOrderData };

                if (previewData.cakeType === 'showcase') {
                    delete previewData.customCakeSize; delete previewData.customCakeType; delete previewData.customOtherCakeType;
                    delete previewData.customCakeFlavor; delete previewData.customFillings; delete previewData.customFillingArrangement;
                    delete previewData.customHalf1Fillings; delete previewData.customHalf2Fillings; delete previewData.customDecorationDetails;
                    delete previewData.customCakeMessage; delete previewData.customDominantColors; // la imagen también sobra en vitrina
                    delete previewData.customCakeImage; delete previewData.customCakeImageBase64;
                    delete previewData.customComments;
                } else {
                    delete previewData.showcaseCake; delete previewData.showcaseCakeSize; delete previewData.showcaseComments;
                    if (previewData.customCakeType !== 'otro') delete previewData.customOtherCakeType;
                    const selectedFillingsCount = previewData.customFillings ? previewData.customFillings.length : 0;
                    if (selectedFillingsCount !== 2) {
                        delete previewData.customFillingArrangement; delete previewData.customHalf1Fillings; delete previewData.customHalf2Fillings;
                    } else if (previewData.customFillingArrangement !== 'mitad_mitad') {
                        delete previewData.customHalf1Fillings; delete previewData.customHalf2Fillings;
                    }
                }

                displayOrderPreview(previewData);
                // Restauramos texto del botón (el modal bloquea la interacción)
                if (btn) btn.textContent = originalButtonText;
                return; // <- evitamos el fetch del primer submit
            }

            // === Si quisieras enviar directo (sin preview), cambia __USE_PREVIEW_FLOW__ a false
            const data = buildTempOrderDataFromForm();
            data.cakeType = cakeTypeHiddenInput.value;

            // Limpieza según tipo (igual que tenías)
            if (data.cakeType === 'showcase') {
                delete data.customCakeSize;
                delete data.customCakeType;
                delete data.customOtherCakeType;
                delete data.customCakeFlavor;
                delete data.customFillings;
                delete data.customFillingArrangement;
                delete data.customHalf1Fillings;
                delete data.customHalf2Fillings;
                delete data.customDecorationDetails;
                delete data.customCakeMessage;
                delete data.customDominantColors;
                delete data.customCakeImage;
                delete data.customComments;
                delete data.customCakeImageBase64;
            } else {
                delete data.showcaseCake;
                delete data.showcaseCakeSize;
                delete data.showcaseComments;
                if (data.customCakeType !== 'otro') delete data.customOtherCakeType;
                const selectedFillingsCount = data.customFillings ? data.customFillings.length : 0;
                if (selectedFillingsCount !== 2) {
                    delete data.customFillingArrangement;
                    delete data.customHalf1Fillings;
                    delete data.customHalf2Fillings;
                } else if (data.customFillingArrangement !== 'mitad_mitad') {
                    delete data.customHalf1Fillings;
                    delete data.customHalf2Fillings;
                }
            }

            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Enviando...';
            }

            console.log('[ENVÍO directo] URL:', SCRIPT_URL);
            console.log('[ENVÍO directo] Payload:', data);

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                redirect: 'follow',
                body: JSON.stringify(data)
            })
            .then(async (response) => {
                const raw = await response.clone().text();
                console.log('[ENVÍO directo] status', response.status);
                console.log('[ENVÍO directo] raw', raw);
                try {
                    return JSON.parse(raw);
                } catch (e) {
                    return { status: 'error', message: 'Respuesta no JSON del servidor' };
                }
            })
            .then(result => {
                if (result.status === "success") {
                    showNotice("¡Pedido enviado con éxito! Tu número de orden es: " + result.orderNumber, 'success', { sticky: true });

                    // === NUEVO: accionar según preferencia de contacto (directo) ===
                    const chosenMethod = getContactMethodValue(data.contactMethod);
                    const lang = (typeof currentLang !== "undefined" ? currentLang : (document.documentElement.lang || "es"));
                    if (chosenMethod === "whatsapp") {
                      openWhatsAppToBakery(result.orderNumber, data, lang);
                    } else if (chosenMethod === "sms") {
                      openSmsToBakery(result.orderNumber, data, lang);
                    } else if (chosenMethod === "phonecall") {
                      callBakery();
                    }
                    // Si es "email", el Apps Script envía el correo al cliente.

                    orderForm.reset();
                    if(orderDateInput) orderDateInput.value = getCurrentDateFormatted();
                    translatePage(currentLang);
                    const showcaseTabButton = document.querySelector('.tab-button[onclick*="showcase"]');
                    if (showcaseTabButton) {
                        openCakeSection({currentTarget: showcaseTabButton}, 'showcase');
                    }
                    if (fillingsCheckboxesContainer) {
                        fillingsCheckboxesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                        if (typeof updateSelectedFillingsDisplay === 'function') updateSelectedFillingsDisplay();
                        if (fillingArrangementGroup) fillingArrangementGroup.style.display = 'none';
                        fillingArrangementRadios.forEach(radio => { radio.checked = false; radio.required = false; });
                        if (halfAndHalfSpecificationGroup) halfAndHalfSpecificationGroup.style.display = 'none';
                        if (half1FillingsInput) half1FillingsInput.value = '';
                        if (half2FillingsInput) half2FillingsInput.value = '';
                    }
                } else {
                    showNotice("Error al enviar el pedido: " + (result.message || "Error desconocido."), 'error');
                }
            })
            .catch(error => {
                console.error("Error en fetch:", error);
                showNotice("Hubo un problema de conexión al enviar tu pedido. Por favor, intenta de nuevo.", 'error');
            })
            .finally(() => {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = originalButtonText;
                }
            });
        });
    }

    // ======== Segundo listener de SUBMIT (tu versión de preview). Lo dejamos activo ========
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            if (window.__USE_PREVIEW_FLOW__ !== true) return; // si no usamos preview, no duplicar
            event.preventDefault();
            const mainSubmitButton = document.getElementById('submitOrderBtn');

            if (validateForm()) {
                if (mainSubmitButton) mainSubmitButton.disabled = true;
                tempOrderData = buildTempOrderDataFromForm();

                let previewData = { ...tempOrderData };

                if (previewData.cakeType === 'showcase') {
                    delete previewData.customCakeSize; delete previewData.customCakeType; delete previewData.customOtherCakeType;
                    delete previewData.customCakeFlavor; delete previewData.customFillings; delete previewData.customFillingArrangement;
                    delete previewData.customHalf1Fillings; delete previewData.customHalf2Fillings; delete previewData.customDecorationDetails;
                    delete previewData.customCakeMessage; delete previewData.customDominantColors; delete previewData.customCakeImage;
                    delete previewData.customCakeImageBase64; delete previewData.customComments;
                } else {
                    delete previewData.showcaseCake; delete previewData.showcaseCakeSize; delete previewData.showcaseComments;
                    if (previewData.customCakeType !== 'otro') delete previewData.customOtherCakeType;
                    const selectedFillingsCount = previewData.customFillings ? previewData.customFillings.length : 0;
                    if (selectedFillingsCount !== 2) {
                        delete previewData.customFillingArrangement; delete previewData.customHalf1Fillings; delete previewData.customHalf2Fillings;
                    } else if (previewData.customFillingArrangement !== 'mitad_mitad') {
                        delete previewData.customHalf1Fillings; delete previewData.customHalf2Fillings;
                    }
                }
                displayOrderPreview(previewData);
            } else {
                if (mainSubmitButton) mainSubmitButton.disabled = false;
            }
        });
    }

    // ====== Confirmar desde el MODAL de preview (ENVIAR REAL) ======
    if (previewConfirmOrderBtn) {
        previewConfirmOrderBtn.addEventListener('click', function() {
            const originalConfirmBtnText = previewConfirmOrderBtn.textContent;
            previewConfirmOrderBtn.disabled = true;
            if (cancelPreviewBtn) cancelPreviewBtn.disabled = true;
            previewConfirmOrderBtn.textContent = 'Enviando...';

            let dataToSend = { ...tempOrderData };

            if (dataToSend.cakeType === 'showcase') {
                delete dataToSend.customCakeSize; delete dataToSend.customCakeType; delete dataToSend.customOtherCakeType;
                delete dataToSend.customCakeFlavor; delete dataToSend.customFillings; delete dataToSend.customFillingArrangement;
                delete dataToSend.customHalf1Fillings; delete dataToSend.customHalf2Fillings; delete dataToSend.customDecorationDetails;
                delete dataToSend.customCakeMessage; delete dataToSend.customDominantColors; delete dataToSend.customCakeImage;
                delete dataToSend.customComments; delete dataToSend.customCakeImageBase64;
                // Limpieza de nuevos campos de decoración
                delete dataToSend.decTopClosures;
                delete dataToSend.decTopClosuresTone;
                delete dataToSend.decTopClosuresColorSpec;
                delete dataToSend.decBottomClosures;
                delete dataToSend.decBottomClosuresTone;
                delete dataToSend.decBottomClosuresColorSpec;
                delete dataToSend.decRosettes;
                delete dataToSend.decRosettesTone;
                delete dataToSend.decRosettesColorSpec;
            } else {
                delete dataToSend.showcaseCake; delete dataToSend.showcaseCakeSize; delete dataToSend.showcaseComments;
                if (dataToSend.customCakeType !== 'otro') delete dataToSend.customOtherCakeType;
                const sc = dataToSend.customFillings ? dataToSend.customFillings.length : 0;
                if (sc !== 2) {
                    delete dataToSend.customFillingArrangement; delete dataToSend.customHalf1Fillings; delete dataToSend.customHalf2Fillings;
                } else if (dataToSend.customFillingArrangement !== 'mitad_mitad') {
                    delete dataToSend.customHalf1Fillings; delete dataToSend.customHalf2Fillings;
                }

                // Adjuntamos imagen base64 si existe (custom)
                if (currentImageBase64) {
                    dataToSend.customCakeImageBase64 = currentImageBase64;
                }
            }
            delete dataToSend.customFilling;

            console.log('[ENVÍO modal] URL:', SCRIPT_URL);
            console.log('[ENVÍO modal] Payload:', dataToSend);

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                redirect: 'follow',
                body: JSON.stringify(dataToSend)
            })
            .then(async (response) => {
                const raw = await response.clone().text();
                console.log('[ENVÍO modal] status', response.status);
                console.log('[ENVÍO modal] raw', raw);
                try {
                    return JSON.parse(raw);
                } catch (e) {
                    return { status: 'error', message: 'Respuesta no JSON del servidor' };
                }
            })
            .then(result => {
                closeOrderPreview();
                if (result.status === "success") {
                    showNotice("¡Pedido enviado con éxito! Tu número de orden es: " + result.orderNumber, 'success', { sticky: true });

                    // === NUEVO: accionar según preferencia de contacto (preview) ===
                    const chosenMethod = getContactMethodValue(dataToSend.contactMethod);
                    const lang = (typeof currentLang !== "undefined" ? currentLang : (document.documentElement.lang || "es"));
                    if (chosenMethod === "whatsapp") {
                      openWhatsAppToBakery(result.orderNumber, dataToSend, lang);
                    } else if (chosenMethod === "sms") {
                      openSmsToBakery(result.orderNumber, dataToSend, lang);
                    } else if (chosenMethod === "phonecall") {
                      callBakery();
                    }
                    // Si es "email", el Apps Script envía el correo al cliente.

                    orderForm.reset();
                    if(orderDateInput) orderDateInput.value = getCurrentDateFormatted();
                    translatePage(currentLang);
                    const showcaseTabButton = document.querySelector('.tab-button[onclick*="showcase"]');
                    if (showcaseTabButton) {
                        openCakeSection({currentTarget: showcaseTabButton}, 'showcase');
                    }
                    if (fillingsCheckboxesContainer) {
                        fillingsCheckboxesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                        if (typeof updateSelectedFillingsDisplay === 'function') updateSelectedFillingsDisplay();
                        if (fillingArrangementGroup) fillingArrangementGroup.style.display = 'none';
                        fillingArrangementRadios.forEach(radio => { radio.checked = false; radio.required = false; });
                        if (halfAndHalfSpecificationGroup) halfAndHalfSpecificationGroup.style.display = 'none';
                        if (half1FillingsInput) half1FillingsInput.value = '';
                        if (half2FillingsInput) half2FillingsInput.value = '';
                    }
                    // Reset decoración
                    if (decTopClosuresCheckbox) {
                        decTopClosuresCheckbox.checked = false;
                        handleDecorationCheckboxChange(decTopClosuresCheckbox, decTopClosuresToneGroup, decTopClosuresColorSpecGroup, decTopClosuresToneSelect, decTopClosuresColorSpecInput);
                    }
                    if (decBottomClosuresCheckbox) {
                        decBottomClosuresCheckbox.checked = false;
                        handleDecorationCheckboxChange(decBottomClosuresCheckbox, decBottomClosuresToneGroup, decBottomClosuresColorSpecGroup, decBottomClosuresToneSelect, decBottomClosuresColorSpecInput);
                    }
                    if (decRosettesCheckbox) {
                        decRosettesCheckbox.checked = false;
                        handleDecorationCheckboxChange(decRosettesCheckbox, decRosettesToneGroup, decRosettesColorSpecGroup, decRosettesToneSelect, decRosettesColorSpecInput);
                    }
                    // Reset mensaje
                    if (cakeMessageTextarea) {
                        cakeMessageTextarea.value = '';
                        cakeMessageTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    // Reset imagen
                    if (customImageInput) {
                        customImageInput.value = '';
                        currentImageBase64 = '';
                        const pb = document.getElementById('cc-image-preview-box');
                        if (pb) pb.style.display = 'none';
                    }
                } else {
                    showNotice("Error al enviar el pedido: " + (result.message || "Error desconocido."), 'error');
                }
            })
            .catch(error => {
                closeOrderPreview();
                console.error("Error en fetch:", error);
                showNotice("Hubo un problema de conexión al enviar tu pedido. Por favor, intenta de nuevo.", 'error');
            })
            .finally(() => {
                previewConfirmOrderBtn.disabled = false;
                if (cancelPreviewBtn) cancelPreviewBtn.disabled = false;
                previewConfirmOrderBtn.textContent = translations[currentLang].confirmOrderBtn || 'Confirmar Pedido';
            });
        });
    }

    // Initialize page
    translatePage(currentLang);

    // Set initial active tab
    const showcaseTabButton = document.querySelector('.tab-button[onclick*="showcase"]');
    if (showcaseTabButton && showcaseTabButton.classList.contains('active')) {
        openCakeSection({currentTarget: showcaseTabButton}, 'showcase');
    } else {
        const customTabButton = document.querySelector('.tab-button[onclick*="custom"]');
        if (customTabButton && customTabButton.classList.contains('active')) {
            openCakeSection({currentTarget: customTabButton}, 'custom');
        } else if (showcaseTabButton) {
            openCakeSection({currentTarget: showcaseTabButton}, 'showcase');
        }
    }

    if (deliveryDateInput) {
        deliveryDateInput.pattern = "(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\\d\\d";
    }
}); // ======= FIN DOMContentLoaded =======

// ====================== BLOQUE de estado de orden (PRÓXIMAMENTE, ES/EN) ======================
(() => {
  const openBtnId = "order-status-button";
  const overlayId = "order-status-overlay";

  const t = (lang) => {
    const L = (lang === "en") ? "en" : "es";
    return {
      es: {
        title: "Próximamente: seguimiento de pedidos",
        lead:
          "Muy pronto podrás consultar el estado de tu pedido usando tu " +
          "<strong>número de orden</strong>, <strong>nombre</strong> o <strong>teléfono</strong>.",
        note:
          "Estamos realizando mejoras para brindarte un mejor servicio. ¡Gracias por tu paciencia! 💛",
        ok: "Entendido",
      },
      en: {
        title: "Coming soon: order tracking",
        lead:
          "Soon you'll be able to check your order status using your " +
          "<strong>order number</strong>, <strong>name</strong>, or <strong>phone</strong>.",
        note:
          "We're making improvements to serve you better. Thanks for your patience! 💛",
        ok: "Got it",
      },
    }[L];
  };

  const getLang = () => (document.documentElement.lang === "en" ? "en" : "es");

  const openBtn = document.getElementById(openBtnId);
  let overlay = document.getElementById(overlayId);

  // Si no existe el overlay, lo creamos
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = overlayId;
    document.body.appendChild(overlay);
  }

  // Estilo base del overlay (translúcido, coherente con los demás modales del sitio)
  overlay.style.cssText =
    "position:fixed;inset:0;display:none;align-items:center;justify-content:center;" +
    "background:rgba(34,34,34,.6);z-index:9999;padding:1.25rem;";

  function renderModal() {
    const copy = t(getLang());
    overlay.innerHTML = `
      <div role="dialog" aria-modal="true" class="order-status-coming-soon">
        <div class="order-status-coming-soon__header">
          <h3>${copy.title}</h3>
          <button id="csClose" aria-label="Cerrar" class="order-status-coming-soon__close">×</button>
        </div>

        <div class="order-status-coming-soon__body">
          <p>${copy.lead}</p>

          <div class="order-status-coming-soon__note">
            <span class="order-status-coming-soon__dot"></span>
            <p>${copy.note}</p>
          </div>
        </div>

        <div class="order-status-coming-soon__footer">
          <button id="csOk" class="order-status-coming-soon__ok">${copy.ok}</button>
        </div>
      </div>
    `;
  }

  // Render inicial
  renderModal();

  const show = () => (overlay.style.display = "flex");
  const hide = () => (overlay.style.display = "none");

  // Abrir desde el botón del header (bloqueando listeners previos)
  if (openBtn) {
    openBtn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        show();
      },
      true
    );
  }

  // Cerrar con X, “Ok” o clic fuera
  overlay.addEventListener("click", (e) => {
    if (e.target.id === "csClose" || e.target.id === "csOk" || e.target === overlay) hide();
  });

  // Desactivar cualquier botón de “Check Status” previo y redirigir al modal
  const checkBtn = document.getElementById("checkStatusBtn");
  if (checkBtn) {
    checkBtn.disabled = true;
    checkBtn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        show();
      },
      true
    );
  }

  // Re-render cuando cambie el idioma (tu translatePage actualiza <html lang>)
  const mo = new MutationObserver((muts) => {
    if (muts.some((m) => m.attributeName === "lang")) renderModal();
  });
  mo.observe(document.documentElement, { attributes: true });

  // Asegurar oculto al cargar
  overlay.style.display = "none";
})();


// MUY IMPORTANTE: aquí apuntamos al botón CONFIRMAR del overlay, no al del modal
const statusConfirmBtnScoped = document.getElementById("confirmationActions") ? document.getElementById("confirmationActions").querySelector("#confirmOrderBtn") : null;

if (statusConfirmBtnScoped) {
  statusConfirmBtnScoped.addEventListener("click", () => {
    if (!ultimoNumeroOrden) return;

    fetch("https://script.google.com/macros/s/AKfycbyfsCSsdKiX8rLAwoNllk-J3lFQbh3Tujb9cEr1dV9aJ3vqtkSsYXeqoioXyWXzP34E/exec", {
      method: "POST",
      body: JSON.stringify({
        numeroOrden: ultimoNumeroOrden,
        nuevoEstado: "Confirmado"
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {
      showNotice("Pedido confirmado correctamente.", 'success');
      document.getElementById("confirmationActions").style.display = "none";
    });
  });
}

document.getElementById("cancelOrderBtn").addEventListener("click", () => {
  document.getElementById("cancelReasonContainer").style.display = "block";
});

document.getElementById("submitCancelBtn").addEventListener("click", () => {
  const motivo = document.getElementById("cancelReason").value.trim();
  if (!motivo) { showNotice("Debes escribir el motivo de cancelación", 'error'); return; }

  fetch("https://script.google.com/macros/s/AKfycbyfsCSsdKiX8rLAwoNllk-J3lFQbh3Tujb9cEr1dV9aJ3vqtkSsYXeqoioXyWXzP34E/exec", {
    method: "POST",
    body: JSON.stringify({
      numeroOrden: ultimoNumeroOrden,
      nuevoEstado: "Cancelado",
      motivoCancelacion: motivo
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(data => {
    showNotice("Pedido cancelado correctamente.", 'success');
    document.getElementById("confirmationActions").style.display = "none";
    document.getElementById("cancelReasonContainer").style.display = "none";
  });
});

function enviarFormulario(referenceImageBase64) {
  const formData = {
    customerName: document.getElementById("customerName").value,
    email: document.getElementById("email").value,
    // ...todos los otros campos...
    referenceImage: referenceImageBase64 || ""
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(data => {
    console.log("Respuesta del servidor:", data);
    showNotice("Pedido enviado con éxito", 'success', { sticky: true });
  })
  .catch(err => {
    console.error("Error al enviar pedido:", err);
    showNotice("Error al enviar el pedido", 'error');
  });
}

// ======== Showcase message options ========
document.getElementById('sc-cakeMessage').addEventListener('input', function () {
    const message = this.value.trim();
    const optionsGroup = document.getElementById('sc-message-options-group');
    if (!optionsGroup) return;
    if (message.length > 0) {
        optionsGroup.style.display = 'block';
        document.querySelectorAll('input[name="sc-messageLocation"]').forEach(r => r.required = true);
        var scMsgColor = document.getElementById('sc-message-color');
        var scMsgFont = document.getElementById('sc-message-font');
        if (scMsgColor) scMsgColor.required = true;
        if (scMsgFont) scMsgFont.required = true;
    } else {
        optionsGroup.style.display = 'none';
        document.querySelectorAll('input[name="sc-messageLocation"]').forEach(r => { r.required = false; r.checked = false; });
        var scMsgColor = document.getElementById('sc-message-color');
        var scMsgFont = document.getElementById('sc-message-font');
        if (scMsgColor) { scMsgColor.required = false; scMsgColor.value = ''; }
        if (scMsgFont) { scMsgFont.required = false; scMsgFont.value = ''; }
    }
});

document.getElementById('sc-message-color').addEventListener('change', function () {
    const selected = this.value;
    const specGroup = document.getElementById('sc-message-color-spec-group');
    if (!specGroup) return;
    if (selected === 'claro' || selected === 'oscuro') {
        specGroup.style.display = 'block';
    } else {
        specGroup.style.display = 'none';
    }
});

  const phoneInput = document.getElementById('phone');

  phoneInput.addEventListener('input', () => {
    // Si hay caracteres que no sean dígitos
    if (/[^0-9]/.test(phoneInput.value)) {
      showNotice('Solo se permiten números en el teléfono', 'error', { duration: 3000 });
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    }
  });

/* ===== Modal de Términos y Condiciones (solo lectura) ===== */
(() => {
  // 1) Encontrar el enlace de "Términos de Servicio" sin tocar tu HTML
  function getTermsLink() {
    // Si existe un id predefinido, úsalo
    const byId = document.getElementById('termsLink');
    if (byId) return byId;

    // Buscar en footers por texto (ES/EN)
    const anchors = document.querySelectorAll('footer .footer-links a, footer a');
    for (const a of anchors) {
      const t = (a.textContent || '').trim().toLowerCase();
      if (t.includes('términos') || t.includes('terms')) return a;
    }
    return null;
  }

  // 2) Crear overlay y cuadro de diálogo (invisibles por defecto)
  const overlay = document.createElement('div');
  overlay.id = 'termsOverlay';
  overlay.style.display = 'none';
  overlay.innerHTML = `
    <div id="termsDialog" role="dialog" aria-modal="true" aria-labelledby="termsTitle">
      <div class="terms-header">
        <h3 id="termsTitle"></h3>
        <button id="termsCloseBtn" type="button" aria-label="Cerrar">×</button>
      </div>
      <div id="termsBody" class="terms-body"></div>
      <div class="terms-footer">
        <button id="termsCloseBtn2" type="button">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 3) Estilos mínimos, aislados por ID (no pisa tus colores globales)
  const style = document.createElement('style');
  style.textContent = `
#termsOverlay{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.55);z-index:9999;}
#termsDialog{width:min(720px,92vw);background:#fff;color:#222;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.4);overflow:hidden;font-family:inherit;}
#termsDialog .terms-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #eee;background:#fff;color:#222;}
#termsDialog #termsCloseBtn{border:0;background:transparent;font-size:22px;cursor:pointer;line-height:1;color:#222;}
#termsDialog .terms-body{padding:18px 20px;max-height:60vh;overflow:auto;line-height:1.55;background:#fff;color:#222;}
#termsDialog .terms-footer{padding:12px 18px;border-top:1px solid #eee;display:flex;justify-content:flex-end;background:#fff;}
#termsDialog .terms-footer button{background:#111;color:#fff;border:0;padding:10px 14px;border-radius:10px;cursor:pointer;}
  `.trim();
  document.head.appendChild(style);

  const titleEl = overlay.querySelector('#termsTitle');
  const bodyEl  = overlay.querySelector('#termsBody');
  const close1  = overlay.querySelector('#termsCloseBtn');
  const close2  = overlay.querySelector('#termsCloseBtn2');

  // 4) Copys ES/EN (solo lectura)
  const copy = (lang) => {
    const L = (lang === 'en') ? 'en' : 'es';
    if (L === 'en') {
      return {
        title: 'Terms & Conditions',
        close: 'Close',
        body: `
          <p>
            By confirming your order, you acknowledge that the information provided is correct and you agree to receive it on the set date and time.
            At Manolo’s Bakery, we will be happy to serve you and prepare your cake with dedication; however, we cannot assume responsibility for later changes
            or claims related to incorrect data or unauthorized modifications.
          </p>
          <p style="font-weight:600;margin-top:10px;">
            NO CASH REFUNDS — See store Refund Policy for details.<br>
            NO SE HACEN REEMBOLSOS EN EFECTIVO — Consulte la Política de reembolso de la tienda para obtener más detalles.
          </p>
        `
      };
    }
    return {
      title: 'Términos y Condiciones',
      close: 'Cerrar',
      body: `
        <p>
          Al confirmar su pedido, usted reconoce que la información proporcionada es correcta y se compromete a recibirlo en la fecha y hora establecidas.
          En Manolo’s Bakery estaremos encantados de atenderle y preparar su pastel con dedicación; sin embargo, no podremos asumir responsabilidad por cambios posteriores
          ni por reclamos relacionados con datos incorrectos o modificaciones no autorizadas.
        </p>
        <p style="font-weight:600;margin-top:10px;">
          NO CASH REFUNDS — See store Refund Policy for details.<br>
          NO SE HACEN REEMBOLSOS EN EFECTIVO — Consulte la Política de reembolso de la tienda para obtener más detalles.
        </p>
      `
    };
  };

  const getLang = () => (typeof currentLang === 'string' ? currentLang : (document.documentElement.lang === 'en' ? 'en' : 'es'));

  function render() {
    const c = copy(getLang());
    titleEl.textContent = c.title;
    bodyEl.innerHTML = c.body;
    close2.textContent = c.close;
  }

  function show() { render(); overlay.style.display = 'flex'; }
  function hide() { overlay.style.display = 'none'; }

  // 5) Abrir desde el enlace del footer
  const link = getTermsLink();
  if (link) {
    link.addEventListener('click', (e) => { e.preventDefault(); show(); });
  }

  // 6) Cerrar con botones o clic afuera
  close1.addEventListener('click', hide);
  close2.addEventListener('click', hide);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hide(); });

  // 7) Re-render al cambiar el idioma (tu script actualiza <html lang>)
  const mo = new MutationObserver((muts) => {
    if (muts.some(m => m.attributeName === 'lang') && overlay.style.display !== 'none') render();
  });
  mo.observe(document.documentElement, { attributes: true });
})();
