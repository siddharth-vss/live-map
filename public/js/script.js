const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(posicion => {
        const {latitude , longitude} = posicion.coords;

        socket.emit('location', {
            lat: latitude,
            lng: longitude
        },(error)=>{
            alert(error);
        },{
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    });
}

const map = L.map("map").setView([0,0],25);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(map);

const markers = {}


socket.on("set-location",(data)=>{
    console.log(data);
    const {id,lat,lng} = data ; 
    map.setView([lat,lng]);

    if(markers[id]){
        markers[id].setLatLng([lat,lng]);
    }else{
        markers[id] = L.marker([lat,lng]).addTo(map);
    }
});

socket.on("user-disconnect",(id)=>{
    console.log("User disconnected",id);
    if(markers[id]){
        markers[id].remove();
        map.removeLayer(markers[id])
        delete markers[id];
    }
})