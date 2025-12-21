import { translations } from './translations.js';

let currentLang = localStorage.getItem("lang") || "fr";

/**
 * Traduit toute la page actuelle
 */
export function translatePage() {
    // 1. Traduire les éléments textuels
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n; // ex: "nav.presentation"
        const translation = getNestedTranslation(translations[currentLang], key);
        
        if (translation) {
            // Si le texte contient du HTML (ex: <span>), on utilise innerHTML
            if (translation.includes('<')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
        }
    });

    // 2. Traduire les attributs (comme aria-label ou placeholder)
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
        const [attr, key] = el.dataset.i18nAttr.split(':');
        const translation = getNestedTranslation(translations[currentLang], key);
        if (translation) {
            el.setAttribute(attr, translation);
        }
    });

    // 3. Mettre à jour la langue du document
    document.documentElement.lang = currentLang;
    
    // 4. Mettre à jour l'icône ou le texte du bouton
    updateLangButton();
}

/**
 * Bascule entre FR et EN
 */
export function toggleLanguage() {
    currentLang = currentLang === "fr" ? "en" : "fr";
    localStorage.setItem("lang", currentLang);
    translatePage();
}

/**
 * Récupère une valeur imbriquée (ex: nav.presentation)
 */
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj);
}

/**
 * Met à jour l'apparence du bouton de langue
 */
function updateLangButton() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;

    // 1. Mise à jour de l'accessibilité (lecture d'écran)
    const nextLang = currentLang === 'fr' ? 'Anglais' : 'Français';
    btn.setAttribute('aria-label', `Passer en ${nextLang}`);

    // 2. On s'assure que l'icône est bien présente
    // On réinjecte la balise <i> pour que Lucide la transforme en SVG propre
    // Cela permet de garder une cohérence avec le bouton de thème
    btn.innerHTML = `<i data-lucide="languages"></i>`;

    // 3. Demander à Lucide de transformer le <i> en <svg>
    if (window.lucide) {
        window.lucide.createIcons();
    }
}