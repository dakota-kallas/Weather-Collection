const cities = {
  lacrosse: { lat: "43.8", lon: "-91.2", cityName: "La Crosse, WI" },
  madison: { lat: "43.14", lon: "-89.35", cityName: "Madison, WI" },
  milwaukee: { lat: "42.96", lon: "-87.9", cityName: "Milwaukee, WI" },
  stpaul: { lat: "44.93", lon: "-93.06", cityName: "St. Paul, MN" },
  duluth: { lat: "46.72", lon: "-92.04", cityName: "Duluth, MN" },
  rochester: { lat: "43.9", lon: "-92.49", cityName: "Rochester, MN" },
};

let citySelect = document.getElementById("city-select");
citySelect.addEventListener("change", displayForecast);

function displayForecast() {
  let CORSObject = null;

  if (typeof XMLHttpRequest != undefined) {
    CORSObject = new XMLHttpRequest();
  } else {
    CORSObject = new XDomainRequest();
  }

  const selectedCity = citySelect.value;
  const city = cities[selectedCity];

  if (CORSObject != null) {
    CORSObject.open(
      "GET",
      "https://forecast.weather.gov/MapClick.php?lat=" +
        city.lat +
        "&lon=" +
        city.lon +
        "&FcstType=json"
    );
    CORSObject.onreadystatechange = function () {
      var data = CORSObject.responseText;
      if (data == "") {
        return;
      }
      var jsonreponse = JSON.parse(data);
      var currentobservation = jsonreponse["currentobservation"];
      var data = jsonreponse["data"];
      var icons = data.iconLink;

      var content = document.getElementById("content");
      clearContents();
      var table = document.createElement("table");
      var thead = document.createElement("thead");
      var tbody = document.createElement("tbody");
      tbody.id = "weather-data";
      table.appendChild(thead);
      table.appendChild(tbody);

      var headingRow = document.createElement("tr");
      var heading = document.createElement("th");
      var headingText = document.createTextNode(city.cityName);
      heading.appendChild(headingText);
      heading.setAttribute(
        "style",
        "border-top-left-radius: 15px; border-top-right-radius: 15px;"
      );
      heading.setAttribute("colspan", "2");
      headingRow.appendChild(heading);
      thead.appendChild(headingRow);

      var imgRow = document.createElement("tr");
      thead.appendChild(imgRow);
      var imgData = document.createElement("td");
      imgData.setAttribute("colspan", "2");
      imgData.setAttribute("style", "padding-bottom: 0;");
      var img = document.createElement("img");
      img.setAttribute("id", "weather-img");
      img.setAttribute("alt", "Weather");
      var imgLink = icons[0];

      // Correct images from having text on them
      if (imgLink.includes("ra") && !imgLink.includes("sn")) {
        imgLink = "https://forecast.weather.gov/newimages/medium/ra.png";
      } else if (
        imgLink.includes("ra") &&
        imgLink.includes("sn") &&
        !imgLink.includes("nra")
      ) {
        imgLink = "https://forecast.weather.gov/newimages/medium/ra_sn.png";
      } else if (
        imgLink.includes("nra") &&
        !imgLink.includes("sn") &&
        !imgLink.includes("nbkn")
      ) {
        imgLink = "https://forecast.weather.gov/newimages/medium/nra.png";
      } else if (imgLink.includes("nra") && imgLink.includes("sn")) {
        imgLink = "https://forecast.weather.gov/newimages/medium/nra_sn.png";
      } else if (imgLink.includes("nbkn") && imgLink.includes("nra")) {
        imgLink = "https://forecast.weather.gov/DualImage.php?i=nra&j=nbkn";
      } else if (imgLink.includes("nsn")) {
        imgLink = "https://forecast.weather.gov/newimages/medium/nsn.png";
      } else if (imgLink.includes("sn")) {
        imgLink = "https://forecast.weather.gov/newimages/medium/sn.png";
      }

      img.setAttribute("src", imgLink);
      imgData.appendChild(img);
      imgRow.appendChild(imgData);

      var tempRow = document.createElement("tr");
      thead.appendChild(tempRow);
      var tempData = document.createElement("td");
      tempData.setAttribute("colspan", "2");
      tempData.setAttribute("style", "padding-top: 0;");
      tempData.setAttribute("id", "temp");
      var tempDataText = document.createTextNode(currentobservation.Temp + "°");
      tempData.appendChild(tempDataText);
      tempRow.appendChild(tempData);

      var tempTextRow = document.createElement("tr");
      thead.appendChild(tempTextRow);
      var tempTextData = document.createElement("td");
      tempTextData.setAttribute("colspan", "2");
      var tempTextDataText = document.createTextNode(data.weather[0]);
      tempTextData.appendChild(tempTextDataText);
      tempTextRow.appendChild(tempTextData);

      var highlowRow = document.createElement("tr");
      thead.appendChild(highlowRow);
      var highlowData = document.createElement("td");
      highlowData.setAttribute("colspan", "2");
      highlowData.className = "last-cell";

      var high = data.temperature[0];
      var low = data.temperature[1];
      if (parseInt(high) < parseInt(low)) {
        var temp = high;
        high = low;
        low = temp;
      }
      high =
        parseInt(high) > parseInt(currentobservation.Temp)
          ? high
          : currentobservation.Temp;
      var highlowDataText = document.createTextNode(
        "H:" + high + "°" + " L:" + low + "°"
      );

      highlowData.appendChild(highlowDataText);
      highlowRow.appendChild(highlowData);

      var aboutRow = document.createElement("tr");
      tbody.appendChild(aboutRow);
      var about = document.createElement("td");
      about.setAttribute("colspan", "2");
      about.className = "first-cell";
      var aboutText = document.createTextNode(data.text[0]);
      about.appendChild(aboutText);
      aboutRow.appendChild(about);

      addTableInfo(
        tbody,
        "Precipitation",
        "images/precipitation.png",
        data.pop[0] != null ? data.pop[0] : "0",
        " %"
      );

      addTableInfo(
        tbody,
        "Wind",
        "images/wind.png",
        currentobservation.Winds,
        " mph"
      );

      addTableInfo(
        tbody,
        "Wind Chill",
        "images/windchill.png",
        currentobservation.WindChill != "NA"
          ? currentobservation.WindChill
          : currentobservation.Temp,
        "° F"
      );

      addTableInfo(
        tbody,
        "Dew Point",
        "images/dew.png",
        currentobservation.Dewp,
        "° F"
      );

      addTableInfo(
        tbody,
        "Visibility",
        "images/visibility.png",
        currentobservation.Visibility,
        " mi"
      );

      addTableInfo(
        tbody,
        "Elevation",
        "images/elevation.png",
        currentobservation.elev,
        " ft",
        true
      );

      var detailsContainer = document.createElement("div");
      detailsContainer.className = "details";
      detailsContainer.appendChild(table);
      content.appendChild(detailsContainer);
    };
    CORSObject.onerror = function () {
      alert("There was an error.");
    };
    CORSObject.send();
  }
}

function addTableInfo(area, label, iconLocation, info, unit, isLast = false) {
  var row = document.createElement("tr");
  area.appendChild(row);
  var header = document.createElement("th");
  var headerText = document.createTextNode(label);
  header.appendChild(headerText);
  var icon = document.createElement("img");
  icon.className = "icon";
  icon.setAttribute("alt", "Icon");
  icon.setAttribute("src", iconLocation);
  header.appendChild(icon);
  row.appendChild(header);
  var data = document.createElement("td");
  var dataText = document.createTextNode(info + unit);
  data.appendChild(dataText);
  if (isLast) {
    header.className = "last-cell";
    header.setAttribute("style", "border-bottom-left-radius: 15px;");
    data.className = "last-cell";
    data.setAttribute("style", "border-bottom-right-radius: 15px;");
  }
  row.appendChild(data);
}

function clearContents() {
  var content = document.getElementById("content");
  var child = content.lastElementChild;
  while (child) {
    content.removeChild(child);
    child = content.lastElementChild;
  }
}
