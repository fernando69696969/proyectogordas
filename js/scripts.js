/*!
 * Start Bootstrap - Landing Page v6.0.6 (https://startbootstrap.com/theme/landing-page)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-landing-page/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project// 1) Choose a default center (Monterrey example). Change to your location.
const center = [25.543069, -103.493611];
const zoom = 12;

const map = L.map("map").setView(center, zoom);
const dialog = document.querySelector(".popup");
const buttonCancel = document.querySelector(".button-cancel");
const buttonSave = document.querySelector(".button-save");
const inputlatitude = document.querySelector(".input-latitude");
const inputlongitude = document.querySelector(".input-longitude");
const placeNameInput = document.querySelector(".place-name");
const entre_calle_input = document.querySelector(".entre_calle");
const y_calle_input = document.querySelector(".y_calle");

const supaBaseUrl = "https://xoffxnjslqswjzmbobtw.supabase.co";
const supaBaseKey = "sb_publishable_hEzswB3L3DmUMijIZ5LwgA_kWvdT45a";
supabase = window.supabase.createClient(supaBaseUrl, supaBaseKey);
const searchInput = document.getElementById("emailAddress");
const searchButton = document.getElementById("submitButton");
const v1 = document.querySelector("#title");

const customIcon = L.icon({
  iconUrl: "./assets/img/chad.ico",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -32],
});

// 6) Buscar un lugar por nombre y centrar el mapa

searchButton.addEventListener("click", async (e) => {
  e.preventDefault(); // evita recargar la página
  const placeName = searchInput.value.trim();

  if (!placeName) {
    alert("Por favor escribe un nombre de puesto");
    return;
  }

  // Consulta en Supabase
  const { data, error } = await supabase
    .from("coordinates")
    .select("*")
    .ilike("placeName", `%${placeName}%`);

  if (error) {
    console.error("Error en Supabase:", error);
    return;
  }

  if (data.length > 0) {
    const { lat, lng, placeName, entre_calle, y_calle } = data[0];

    // Centrar mapa en la ubicación encontrada
    map.setView([parseFloat(lat), parseFloat(lng)], 16);

    // Agregar marcador con popup
    L.marker([parseFloat(lat), parseFloat(lng)], { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<b>${placeName}</b><br>
         Lat: ${lat}, Lng: ${lng}<br>
         Entre: ${entre_calle}<br>
         Y: ${y_calle}`,
      )
      .openPopup();
    document.getElementById("map").scrollIntoView({ behavior: "smooth" });
  } else {
    alert("No se encontró ese puesto en la base de datos");
  }
});

buttonSave.addEventListener("click", async (e) => {
  e.preventDefault();
  const lat = inputlatitude.value;
  const lng = inputlongitude.value;
  const placeName = placeNameInput.value;
  const entre_calle_cons = entre_calle_input.value;
  const y_calle_cons = y_calle_input.value;
  const { error } = await supabase.from("coordinates").insert([
    {
      lat: lat,
      lng: lng,
      placeName: placeName,
      entre_calle: entre_calle_cons,
      y_calle: y_calle_cons,
    },
  ]);

  dialog.close();
});

buttonCancel.addEventListener("click", () => {
  dialog.close();
});
// 2) Create the map

async function loadSavedIcons() {
  const { data, error } = await supabase.from("coordinates").select("*");

  if (error) {
    console.log("Error from supabase", error);
    return;
  }

  data.forEach((element) => {
    const { lat, lng, placeName, entre_calle, y_calle } = element;
    L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<b>${placeName}</b><br>Lat: ${lat}<br>Lng: ${lng}<br>${entre_calle}<br>${y_calle}`,
      );
  });
}
loadSavedIcons();

// otro campo para guardar las entrecalles betweenstreets

// 3) Add the OpenStreetMap tiles
// Note: respect OSM tile usage policy for production/high traffic.
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("click", async (e) => {
  const { lat, lng } = e.latlng;

  inputlatitude.value = lat;
  inputlongitude.value = lng;

  dialog.showModal();
  //if (clickMarker) map.removeLayer(clickMarker); para borraar el anterior

  clickMarker = L.marker([lat, lng], { icon: customIcon })
    .addTo(map)
    .bindPopup(`Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`);

  clickMarker.openPopup();
});
