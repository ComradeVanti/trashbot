<template>
  <button type="button" class="btn">
    <slot></slot>
  </button>
</template>

<script>
</script>

<style>
.btn {
  font-weight: 700;
  font-size: var(--fnt-sze-label);
  box-shadow: var(--sdw-regular);
  border-radius: var(--dim-corners);
  font-family: var(--fnt-btn);
  padding: var(--dim-small) var(--dim-regular);
  border: none;
  width: var(--dim-btn);
}

.btn-primary {
  background: var(--col-btn-primary);
  color: var(--col-on-btn-primary);
}

.btn-secondary {
  background: var(--col-btn-secondary);
  color: var(--col-on-btn-secondary);
}

</style>
