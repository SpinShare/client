import Vue from 'vue';
import VueI18n from 'vue-i18n';
import UserSettings from '@/modules/module.usersettings.js';

import LocaleEN from '@/i18n/en.json';
import LocaleDE from '@/i18n/de.json';
import LocaleNL from '@/i18n/nl.json';
import LocalePL from '@/i18n/pl.json';
import LocaleFR from '@/i18n/fr.json';
import LocalePTBR from '@/i18n/pt-BR.json';
import LocaleES from '@/i18n/es.json';
import LocaleRU from '@/i18n/ru.json';
import LocaleKR from '@/i18n/kr.json';
import LocaleZHCN from '@/i18n/zh-CN.json';
import LocaleSPEEN from '@/i18n/speen.json';

let userSettings = new UserSettings();

Vue.use(VueI18n);

let messages = {
    'en': LocaleEN,
    'de': LocaleDE,
    'nl': LocaleNL,
    'pl': LocalePL,
    'fr': LocaleFR,
    'pt-BR': LocalePTBR,
    'es': LocaleES,
    'ru': LocaleRU,
    'kr': LocaleKR,
    'zh-CN': LocaleZHCN,
    'speen': LocaleSPEEN
};

const i18n = new VueI18n({
    locale: userSettings.get('language'), // set locale
    fallbackLocale: 'en', // set fallback locale
    messages
});

export default i18n;
