<script>
    
    import Icon from 'svelte-awesome';
    import { trash, eye } from 'svelte-awesome/icons';

    let markers = [];
    let currentAction = '';
    let geocodeInputAddress = '';

    function cancelAddMarker() {
        currentAction = '';
    }

    function geocodeAddMarker(){
        currentAction = 'geocodeAddMarker';
    }

    function searchGeocodeAddMarker(){
        
        let title, content;
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': geocodeInputAddress}, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    title = results[0].formatted_address;
                    content = results[0].geometry.location;

                    let marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: window.map,
                        title: title
                    });

                    markers = [...markers, marker];

                    let infoWindow = new google.maps.InfoWindow({
                        content: '<b>'+title+'</b><br/>'+content
                    });

                    marker.addListener('click', function(){
                        infoWindow.open(window.map, marker);
                    });

                    map.setCenter(marker.getPosition());
                    map.setZoom(15);
                    
                    currentAction = '';
                    
                } else {
                    title = 'Error';
                    content = 'No results found';
                }
            } else {
                title = 'Error';
                content = 'Error: ' + status;
            }
            
            geocodeInputAddress = '';
            
        });


    }

    function RemoveMarker(marker){
        marker.setMap(null);

        markers = markers.filter(item => item !== marker)
    }

    function ShowMarker(marker){
        // centers the map in the marker
        map.setCenter(marker.getPosition());
    }

    function addMarker(){
        currentAction = 'manuallyAddMarker';

        window.map.addListener("click", (e) => {
            
            let title, content;

            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({'location': e.latLng}, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        title = results[0].formatted_address;
                        content = e.latLng;
                        
                    } else {
                        title = 'Error';
                        content = 'No results found';
                    }
                } else {
                    title = 'Error';
                    content = 'Error: ' + status;
                }

                
                let marker = new google.maps.Marker({
                    position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
                    map: window.map,
                    title: title
                });

                markers = [...markers, marker];

                let infoWindow = new google.maps.InfoWindow({
                    content: '<b>'+title+'</b><br/>'+content
                });

                marker.addListener('click', function(){
                    infoWindow.open(window.map, marker);
                });
                
                // destroy event listener
                google.maps.event.clearListeners(window.map, 'click');

                currentAction = '';

            });

        });
    }

    function uploadCsv(){
        let file = document.getElementById('csvFile').files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            let csv = reader.result;
            
            let allTextLines = csv.split(/\r\n|\n/);
            let lines = [];

            for (let i=1; i<allTextLines.length; i++) {
                let data = allTextLines[i].split(',');
                if(data[0] != '') {
                    lines.push(data[0]);
                }
            }

            let geocoder = new google.maps.Geocoder();
            
            lines.forEach(line => {
                geocoder.geocode({'address': line}, (results, status) => {
                    
                    if (status === 'OK') {
                        let title, content;

                        if (results[0]) {
                            title = results[0].formatted_address;
                            content = results[0].geometry.location;
                        } else {
                            title = 'Error';
                            content = 'No results found';
                        }
                        let marker = new google.maps.Marker({
                                    position: results[0].geometry.location,
                                    map: window.map,
                                    title: title
                                });

                        markers = [...markers, marker];

                        let infoWindow = new google.maps.InfoWindow({
                            content: '<b>'+title+'</b><br/>'+content
                        });

                        marker.addListener('click', function(){
                            infoWindow.open(window.map, marker);
                        });
                    } else {
                        alert(status);
                    }

                });
            });
        }
    }
</script>

{#if currentAction == 'manuallyAddMarker'}
<div class="fixed top-16 w-screen text-center">
    <span class="bg-white py-4 px-8 opacity-80 text-sm font-bold">Click anywhere on the map
        <button on:click={cancelAddMarker} class="p-2 ml-4 text-xs  border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-gray-100 "><span class="align-text-bottom"></span> Cancel</button>
    </span> 
</div>
{/if}

{#if currentAction == 'geocodeAddMarker'}
<div class="fixed top-16 w-screen text-center">
    <span class="bg-white py-4 px-8 opacity-80 text-sm font-bold">Enter address to geocode 
        <input type="text" class="p-2" bind:value={geocodeInputAddress}>
        <button on:click={searchGeocodeAddMarker} class="p-2 ml-4 text-xs  border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-gray-100 "><span class="align-text-bottom"></span> Geocode</button>
        <button on:click={cancelAddMarker} class="p-2 ml-4 text-xs  border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-gray-100 "><span class="align-text-bottom"></span> Cancel</button>
    </span> 
</div>
{/if}

<div class=" font-bold text-sm text-gray-700 mt-2 mb-2">Actions</div>


<div class="flex items-center mr-1 mb-2 ">
    <button on:click={addMarker} class="p-2 w-full text-xs bg-transparent border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-gray-100"><span class="align-text-bottom"> Manually add marker</button>
</div>
<div class="flex items-center mr-1 mb-2 ">
    <button on:click={geocodeAddMarker} class="p-2 w-full text-xs bg-transparent border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-gray-100 "><span class="align-text-bottom"></span> Add marker using geocode</button>
</div>

<div class="flex items-center mr-1 mb-2">
    <input class="hidden" type="file" id="csvFile" on:change={uploadCsv}>
    <button on:click="{() => document.getElementById('csvFile').click() }" class="p-2 w-full text-xs bg-transparent border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-gray-100 "><span class="align-text-bottom"></span> Geocode from csv</button>
</div>


<div class="font-bold text-sm text-gray-700 mt-4 mb-2">Markers ({markers.length})</div>

<div class="overflow-auto h-96">

    {#each markers as marker}
        <div class="text-center p-3 mr-2 mt-1 border-2 border-gray-400  border-solid font-semiboldbold">
            <p class="text-sm pb-2 text-gray-6002">{marker.title}</p>
            <button class="text-sm bg-blue-400 text-gray-200 pt-1 pb-2 hover:bg-blue-300 w-8"  on:click={ShowMarker(marker)}><Icon data={eye} label="Show"/></button>
            <button class="text-sm bg-red-600 text-gray-200 pt-1 pb-2 hover:bg-red-500 w-8"  on:click={RemoveMarker(marker)}><Icon data={trash} label="Remove"/></button>
        </div>
    {/each}

</div>