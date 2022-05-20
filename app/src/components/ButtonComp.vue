<template>
  <button type="button">
    <slot></slot>
  </button>
</template>

<script>
</script>

<style>
button {
  font-weight: 700;
  font-size: var(--fnt-sze-regular);
  box-shadow: var(--sdw-regular);
  border-radius: var(--dim-corners);
  padding: var(--dim-small) var(--dim-regular);
  border: none;
  width: var(--dim-btn);
}

.btn-primary {
  background: var(--col-primary);
  color: var(--col-on-primary);
}

.btn-secondary {
  background: var(--col-secondary);
  color: var(--col-on-secondary);
}

</style>
