<template>
  <div class="action-view">
    <div class="action-view__title">
      <h1 class="action-view__title-text"> {{T("YOUR_TURN")}} </h1>
    </div>
    <div class="action-view__resources">
      <h2 class="action-view__resources-title"> {{T("CURRENT_RESOURCES")}} </h2>
      <ul class="action-view__resources-list">
        <li class="action-view__resources-item">Grain <span class="action-view__resources-count">1</span></li>
        <li class="action-view__resources-item">Wool <span class="action-view__resources-count">1</span></li>
        <li class="action-view__resources-item">Wood <span class="action-view__resources-count">1</span></li>
        <li class="action-view__resources-item">Ore <span class="action-view__resources-count">1</span></li>
        <li class="action-view__resources-item">Stone <span class="action-view__resources-count">1</span></li>
      </ul>
    </div>
    <div class="action-view__trade">
      <button class="action-view__trade-button"> {{T("TRADE")}} </button>
    </div>
    <div class="action-view__actions">
      <p class="action-view__actions-hint"> {{T("ACTIONS_HINT")}} </p>
    </div>
    <div class="action-view__finish">
      <button class="action-view__finish-button"> {{T("FINISH_TURN")}} </button>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style scoped>
  .action-view {
    background: #333;
    position: absolute;
    width: 400px;
    height: 80vh;
    color: white;
    border-radius: 4px;
    right: -400px;
    top: 96px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    transition: right 300ms;
  }

  .action-view--visible {
    right: 24px;
  }

  .action-view > * {
    padding: 4px 0;
  }

  .action-view__title {
    border-bottom: solid 1px #444;
  }

  .action-view__title-text {
    margin: 0;
  }

  .action-view__resources-title {
    margin: 0;
  }

  .action-view__actions {
    flex-grow: 1;
  }

  .action-view__trade-button,
  .action-view__finish-button {
    width: 100%;
  }

  .action-view__finish-button {
    font-size: large;
    font-weight: bold;
  }
</style>
