<template>
    <section class="section-settings">
        <div class="settings-box">
            <div class="settings-title" locale>settings.general.header</div>
            <div class="settings-item">
              <div class="settings-label" locale>settings.general.version.label</div>
              <div class="settings-input">
                <span class="settings-input-version"></span>
              </div>
            </div>
            <div class="settings-item">
              <div class="settings-label" locale>settings.general.update.label</div>
              <div class="settings-input">
                <button onclick="CheckForUpdates(true)" locale>settings.general.update.button</button>
              </div>
            </div>
          </div>
          <div class="settings-box">
            <div class="settings-title" locale>settings.language.header</div>
            <div class="settings-item">
              <div class="settings-label" locale>settings.language.selectLanguage.label</div>
              <div class="settings-input">
                <select onchange="SettingsChangeLanguage()" class="settings-input-language">
                  <option value="en">English (English)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="nl">Nederlands (Dutch)</option>
                  <option value="fr">Français (French)</option>
                  <option value="pt-BR">Português Brasileiro (Brazilian Portuguese)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="ru">Русский (Russian)</option>
                  <option value="kr">한국어 (Korean)</option>
                  <option value="zh-CN">简体中文 (Simplified Chinese)</option>
                  <option value="speen">Speen (Speen)</option>
                </select>
              </div>
            </div>
          </div>
          <div class="settings-box">
            <div class="settings-title" locale>settings.directories.header</div>
            <div class="settings-item">
              <div class="settings-label" locale>settings.directories.gameDirectory.label</div>
              <div class="settings-input settings-input-twobuttons">
                <input type="text" disabled class="settings-input-gamedirectory" />
                <button onclick="SettingsSelectGameDirectory()" locale>settings.directories.gameDirectory.changeButton</button>
                <button onclick="SettingsResetGameDirectory()" locale>settings.directories.gameDirectory.resetButton</button>
              </div>
            </div>
          </div>
    </section>
</template>

<script>
    export default {
        name: 'Settings',
        components: {
        }
    }
</script>

<style scoped lang="less">
    section {
        padding: 50px;
    }
</style>