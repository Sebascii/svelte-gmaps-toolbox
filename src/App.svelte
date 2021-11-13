<style lang="postcss" global>
	@tailwind base;
	@tailwind components; 
	@tailwind utilities;
	:global(body) {
		padding: 0;
	}


	/* width */
	::-webkit-scrollbar {
	width: 12px;
	height: 16px;
	}

	/* Track */
	::-webkit-scrollbar-track {
	border-radius: 100vh;
	background: #edf2f7;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
	background: #cbd5e0;
	border-radius: 100vh;
	border: 3px solid #edf2f7;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
	background: #a0aec0;
	}
</style>


<script>
	import Icon from 'svelte-awesome';
    import { trash } from 'svelte-awesome/icons';
	import Map from './components/Map.svelte';
	import MapActions from './components/MapActions.svelte';
	import Config from './components/Config.svelte';
	import { google_api_key } from './stores/store.js';
	


	export let ready;

	let google_api_key_value;

	google_api_key.subscribe(value => {
		google_api_key_value = value;
		localStorage.setItem("google_api_key", value);
	});

	function forgetKey(){
        google_api_key.set(null);
        window.location.reload();
    }

		
</script>


<svelte:head>
	{#if google_api_key_value != 'null'}
		<script defer async src="https://maps.googleapis.com/maps/api/js?key={google_api_key_value}&callback=initMap"></script>
	{/if}
</svelte:head>

<div id="side-bar" class="z-10 opacity-90 ml-2 fixed h-5/6 w-48 top-10 rounded-xl bg-gray-100 shadow-lg py-3 pl-2 ">
	<div class="flex flex-col justify-between ">

		<h1 class="font-semibold text-gray-800 text-center">Svelte Gmaps Toolbox</h1>
		<hr class="my-3 mr-2 divide-solid divide-black" />
		<div class="hover:overflow-auto overflow-hidden ">
			<div class="mb-10">
				{#if google_api_key_value != 'null'}
					<MapActions></MapActions>

					<div class="mr-1 mt-3 ">
						<button class="text-sm w-full bg-blue-600 text-gray-200 p-2 hover:bg-blue-500"  on:click={forgetKey}><Icon data={trash} label="Forget API key"/> <span>Forget API Key</span></button>
					</div>

				{ /if }
				
			</div>
		</div>
	</div>
</div>

{#if google_api_key_value != 'null'}
	{ #if ready }
		<Map></Map>
	{ /if }
{:else}
	<Config />
{/if}

