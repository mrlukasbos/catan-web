<template>
  <div class="action-sidebar">
    <div class="action-sidebar__title">
      <h1 class="action-sidebar__title-text"> {{T("YOUR_TURN")}} </h1>
    </div>
    <div class="action-sidebar__resources">
      <h2 class="action-sidebar__resources-title"> {{T("CURRENT_RESOURCES")}} </h2>
      <ul class="action-sidebar__resources-list">
        <li class="action-sidebar__resources-item">Grain <span class="action-sidebar__resources-count">1</span></li>
        <li class="action-sidebar__resources-item">Wool <span class="action-sidebar__resources-count">1</span></li>
        <li class="action-sidebar__resources-item">Wood <span class="action-sidebar__resources-count">1</span></li>
        <li class="action-sidebar__resources-item">Ore <span class="action-sidebar__resources-count">1</span></li>
        <li class="action-sidebar__resources-item">Stone <span class="action-sidebar__resources-count">1</span></li>
      </ul>
    </div>
    <div class="action-sidebar__trade">
      <button class="action-sidebar__trade-button"> {{T("TRADE")}} </button>
    </div>
    <div class="action-sidebar__actions">
      <p class="action-sidebar__actions-hint"> {{T("ACTIONS_HINT")}} </p>
    </div>
    <div class="action-sidebar__finish">
      <button class="action-sidebar__finish-button"> {{T("FINISH_TURN")}} </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "action-sidebar"
  }
</script>

<style scoped>
  .action-sidebar {
    width: 400px;
    height: 100%;
    background-color: #000;
    border-left: solid 1px #444;
    padding: 8px;
    color: #fff;
    display: flex;
    flex-direction: column;
  }

  .action-sidebar > * {
    padding: 4px 0;
  }

  .action-sidebar__title {
    border-bottom: solid 1px #444;
  }

  .action-sidebar__title-text {
    margin: 0;
  }

  .action-sidebar__resources-title {
    margin: 0;
  }

  .action-sidebar__actions {
    flex-grow: 1;
    overflow-y: scroll;
  }

  .action-sidebar__trade-button,
  .action-sidebar__finish-button {
    width: 100%;
  }

  .action-sidebar__finish-button {
    font-size: large;
    font-weight: bold;
  }
</style>
