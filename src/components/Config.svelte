<script>
    import { google_api_key } from '../stores/store.js';

    let gmaps_api_key;
    function saveKey(){
        google_api_key.set(gmaps_api_key);
        window.location.reload();
    }
</script>

<div class="text-center">
    <p class="p-4 font-bold ">Insert your google maps api key </p>
    <input class="p-2 text-sm" bind:value={gmaps_api_key} type="text">
    <button class="bg-blue-600 text-gray-200 text-sm p-2 hover:bg-blue-500" on:click={saveKey}>Save in local storage</button>

</div>