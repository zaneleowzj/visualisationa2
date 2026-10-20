const publicArtMap = L.map("melbournePublicArtMap").setView(
  [-37.8136, 144.9631], // Sets the field for Melbourne CBD Specifically through Long/Lat
  14
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(publicArtMap); //Adds the base map in 

// Add interactive controls above the map.
const controls = L.control({ position: "topright" });
//Create the map control 
controls.onAdd = function () {
  const div = L.DomUtil.create("div", "public-art-controls");

  div.innerHTML = `
    <label for="artTypeFilter"><strong>Asset type</strong></label>
    <select id="artTypeFilter">
      <option value="All">All types</option>
      <option value="Art">Art</option>
      <option value="Monument">Monuments</option>
      <option value="Fountain">Fountains</option>
    </select>

    <label for="artSearch"><strong>Search artwork or artist</strong></label>
    <input id="artSearch" type="text" placeholder="Type a name..." />

    <button id="resetArtFilters" type="button">Reset filters</button>
  `;

  L.DomEvent.disableClickPropagation(div);
  L.DomEvent.disableScrollPropagation(div);
  return div;
};

controls.addTo(publicArtMap);

// Colours by asset type.
const typeColours = {
  Art: "#3777C8",
  Monument: "#E88BB5",
  Fountain: "#E3A43B"
};

const markerLayer = L.layerGroup().addTo(publicArtMap);
let artworkRecords = [];

//Allows Text Regex Simplification 
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    }[char];
  });
}
//Renders the Map 
function renderArtworks() {
  markerLayer.clearLayers();

  const selectedType =
    document.getElementById("artTypeFilter").value;
  const searchTerm =
    document.getElementById("artSearch").value.trim().toLowerCase();

  artworkRecords.forEach(function (d) {
    const type = (d.AssetType || "").trim();
    const name = (d.Name || "").toLowerCase();
    const artist = (d.Artist || "").toLowerCase();

    if (selectedType !== "All" && type !== selectedType) return;
    if (
      searchTerm &&
      !name.includes(searchTerm) &&
      !artist.includes(searchTerm)
    ) return;

    const lat = Number(d.Latitude);
    const lon = Number(d.Longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

    const colour = typeColours[type] || "#777777";

    const marker = L.circleMarker([lat, lon], {
      radius: 7,
      fillColor: colour,
      color: "#ffffff",
      weight: 1,
      fillOpacity: 0.85
    });

    marker.bindPopup(`
      <div class="art-popup">
        <strong>${escapeHtml(d.Name || "Untitled")}</strong><br>
        <b>Type:</b> ${escapeHtml(type || "Not recorded")}<br>
        <b>Artist:</b> ${escapeHtml(d.Artist || "Not recorded")}<br>
        <b>Date:</b> ${escapeHtml(d.ArtDate || "Not recorded")}<br>
        <b>Structure:</b> ${escapeHtml(d.Structure || "Not recorded")}<br>
        <b>Address:</b> ${escapeHtml(d.Address || "Not recorded")}
      </div>
    `);

    marker.on("mouseover", function () {
      this.setStyle({
        radius: 11,
        weight: 2,
        fillOpacity: 1
      });
      this.bringToFront();
    });

    marker.on("mouseout", function () {
      this.setStyle({
        radius: 7,
        weight: 1,
        fillOpacity: 0.85
      });
    });

    markerLayer.addLayer(marker);
  });
}

// Load the CSV.
Papa.parse("../data/melbourne_public_art_cleaned.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,

  complete: function (results) {
    artworkRecords = results.data;
    renderArtworks();

    document.getElementById("artTypeFilter")
      .addEventListener("change", renderArtworks);

    document.getElementById("artSearch")
      .addEventListener("input", renderArtworks);

    document.getElementById("resetArtFilters")
      .addEventListener("click", function () {
        document.getElementById("artTypeFilter").value = "All";
        document.getElementById("artSearch").value = "";
        renderArtworks();
      });

    console.log("Loaded artwork records:", artworkRecords.length);
  },

  error: function (error) {
    console.error("Failed to load public art CSV:", error);
  }
});