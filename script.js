//Første dataene i rekken til arrayet. Vi lister ut de første 20 dagene i tabellen.
let start = 20;
//Forrige dataene i rekken til arrayet. Denne blir brukt slik at den fjerner de første 20 dagene i tabellen når vi blar videre i tabellen.
let deletePrev = 0;

//Starter med å låse "Previous" knappen
document.getElementById("btnPrev").disabled = true;
//Starter med å åpne "Next" knappen
document.getElementById("btnNext").disabled = false;

//Dato variabel for unix timestamp
let date;

//Henter dataene fra API og lister dem ut i en tabell
function fetchData() {
  fetch(
    "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=100&api_key=8ae55d463e1bf8d38b4a502ca47512f9b1dec21533ad9af7acb993e8ba952bc2"
  )
    .then((response) => {
      if (!response.ok) {
        throw Error("ERROR");
      }
      return response.json();
    })
    .then((info) => {
      if (info.Data.Data.length > 0) {
        var temp = "";
        info.Data.Data.forEach((crypto, index) => {
          //Unix timestamp konvertering til sanntid
          date = new Date(crypto.time * 1000).toLocaleDateString("en-GB");

          //Skriver ut dataene med index mellom forrige dataene og start dataene
          if (index < start && deletePrev <= index) {
            temp += "<tr>";
            temp += "<td>" + (index + 1) + "</td>"; //Arrayet lister fra og med 0. Det blir index + 1 fordi vi skal vise første dagen
            temp += "<td>" + "$" + crypto.high + "</td>";
            temp += "<td>" + "$" + crypto.low + "</td>";
            temp += "<td>" + "$" + crypto.open + "</td>";
            temp += "<td>" + date + "</td>";
          }
        });
      }

      //Åpner knappen "Previous" når den er større enn null (Blir låst på første side av tabellen)
      if (deletePrev > 0) {
        //deletePrev = 0
        document.getElementById("btnPrev").disabled = false;
      } else {
        document.getElementById("btnPrev").disabled = true;
      }

      //Låser knappen "Next" når den er større enn 101 (array). Blir låst på siste side av tabellen.
      if (start < info.Data.Data.length - 1) {
        //Length = 101; Vi har lyst å liste ut bare de første 100 dagene
        document.getElementById("btnNext").disabled = false;
      } else {
        document.getElementById("btnNext").disabled = true;
      }

      //Lister ut tabellen
      document.getElementById("info.Data.Data").innerHTML = temp;
    })
    .catch((error) => {
      console.log(error);
    });
}

/*
En del av paginering logikk. 

Øker variabel "start" med 20 og lister de neste 20 fra arrayet når vi trykker på "Next" knappen fra tabellen. 
De forrige 20 dataene blir ikke vist i tabellen lenger med "deletePrev"
*/
function nextPage() {
  start = start + 20;
  deletePrev = deletePrev + 20;
  document.getElementById("btnPrev").disabled = false;

  fetchData();
}

/*
En del av paginering logikk. 

Minsker variabel "start" med 20 og lister de forrige 20 fra arrayet når vi trykker på "Previous" knappen fra tabellen. 
De daværende 20 dataene blir ikke vist i tabellen lenger med "deletePrev"
*/
function prevPage() {
  start -= 20;
  deletePrev -= 20;

  fetchData();
}

/*
En del av paginering logikk. 

Lister ut 20 ulike data for hver gang vi trykker på de nummerte sideknappene fra tabellen. Vi vet at vi skal liste ut 100 dager til sammen. 
Vi grupperer dem for hver 20. dag
*/
function page(page) {
  switch (page) {
    case 1:
      start = 20;
      deletePrev = 0;
      break;
    case 2:
      start = 40;
      deletePrev = 20;
      break;
    case 3:
      start = 60;
      deletePrev = 40;
      break;
    case 4:
      start = 80;
      deletePrev = 60;
      break;
    case 5:
      start = 100;
      deletePrev = 80;
      break;
  }
  fetchData();
}

fetchData();
