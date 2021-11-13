<script>
    import mapStyles from '../map-styles'; // optional

   let container;
   let zoom = 8;
   let center = {lat: -34.6037387, lng: -58.3814559};
   
   import { onMount } from 'svelte';
   
   onMount(async () => {
       window.map = new google.maps.Map(container, {
           zoom,
           center,
           disableDefaultUI: true,
           styles: mapStyles // optional
       });
   });
    
</script>

<style>
.full-screen {
   width: 100vw;
   height: 100vh;
   z-index:0;
}
</style>

<div class="full-screen" id="map" bind:this={container}></div>
