<script setup>
import { useTableStore } from './store/table';
const tableStore = useTableStore();
onMounted(async () => {
  await tableStore.fetchTables();
})

import { useQueueStore } from './store/queue'

const queueStore = useQueueStore()

onMounted(async () => {
  await queueStore.fetchQueues()
});
</script>


<template>
  <VApp>
    <RouterView />
  </VApp>
</template>
