<template>
    <SlidesPosters />
    <NewActivities />
    <NewAlertsAndEvents />
    <TogetherSection />
</template>


<script>
import SlidesPosters from '@/components/IndexPageComponents/SlidesPosters'
import NewActivities from '@/components/IndexPageComponents/NewActivities'
import NewAlertsAndEvents from '@/components/IndexPageComponents/NewAlertsAndEvents'
import TogetherSection from '@/components/IndexPageComponents/TogetherSection'


export default {
  name: 'IndexPage',
  components: {
    SlidesPosters,
    NewActivities,
    NewAlertsAndEvents,
    TogetherSection
  },


}
</script>

<style>

</style>