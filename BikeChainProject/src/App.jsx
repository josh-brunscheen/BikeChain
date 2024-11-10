import { useState } from 'react'
import { useEffect } from 'react'
// import bike from '../public/bikes.json';//jsonfile with bike data
import './App.css'
import Modal from './Modal.jsx'

function App() {
  const [userLoc, setUserLoc] = useState({"latitude": 0, "longitude": 0});
  const [highlightId, setId] = useState(-1);
  const [renting,setRenting] = useState({"renting":[]});
  const [isOn, setIsOn] = useState(false);
  const [bikes, setBikes] = useState({
    "available": [
        {
            "id": "0",
            "price": "$5.00",
            "condition": "10",
            "long": -73.6876,
            "lat": 42.7081,
            "prevOwners": []
        },
        {
            "id": "1",
            "price": "$6.25",
            "condition": "10",
            "long": -73.6780,
            "lat": 42.7381,
            "prevOwners": []
        },
        {
            "id": "2",
            "price": "$3.25",
            "condition": "10",
            "long": -73.6950,
            "lat": 42.7281,
            "prevOwners": []
        },
        {
          "id": "3",
          "price": "$4.25",
          "condition": "10",
          "long": -73.6950,
          "lat": 42.7081,
          "prevOwners": []
        },
        {
          "id": "4",
          "price": "$7.25",
          "condition": "10",
          "long": -73.65,
          "lat": 42.7281,
          "prevOwners": []
        },
    ],
    "currentlyLeasing": [
        {
            "id": "5",
            "price": "$7.25",
            "condition": "10",
            "long": "",
            "lat": "",
            "prevOwners": []
        },
    ]
});

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; //Radius of the Earth

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  const handleNewLease = () => {
    setIsOn(true);
  }

  const handleRentOut = (bikeId) => {
    const newBikes = { ...bikes }; // Create a copy of the bikes state
  
    // Find the index of the bike to be moved in the available array
    const availableIndex = newBikes.available.findIndex(bike => bike.id === bikeId);
  
    // Remove the bike from the available array
    const bikeToMove = newBikes.available.splice(availableIndex, 1)[0];
  
    // Add the bike to the currentlyLeasing array
    newBikes.currentlyLeasing.push(bikeToMove);
  
    // Update the state with the new bikes object
    setBikes(newBikes);
  };


  const handleListRental = (bikeId) => {
    console.log("GIMME THAT SHIT RN");
    console.log(bikeId);
    const newBikes = { ...bikes }; // Create a copy of the bikes state
  
    // Find the index of the bike to be moved in the available array
    const leasingIndex = newBikes.currentlyLeasing.findIndex(bike => bike.id === bikeId);
  
    // Remove the bike from the leasing array
    const bikeToMove = newBikes.currentlyLeasing.splice(leasingIndex, 1)[0];
    bikeToMove.long = userLoc.longitude;
    bikeToMove.lat = userLoc.latitude;
    console.log(bikeToMove);
    // Add the bike to the available array
    newBikes.available.push(bikeToMove);
  
    // Update the state with the new bikes object
    setBikes(newBikes);
    console.log(bikes);
  };

  useEffect(() => {
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: "YOURAPIKEYHERE",
      v: "weekly",
      // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
      // Add other bootstrap parameters as needed, using camel case.
    });

    let map;

    async function initMap() {
      const { Map } = await google.maps.importLibrary("maps");

      map = new Map(document.getElementById("map"), {
        center: { lat: 42.7281, lng: -73.6876 },
        zoom: 13,
        mapId: "66bbf456a1ff8ea5",
      });

      addMarkers(map);
    }
    
    async function addMarkers(map) {
      const { InfoWindow } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
        "marker",
      );

      const markers = [];

      const infoWindow = new InfoWindow();

      bikes.available.forEach((bike, i) => {
        const pin = new PinElement({
          glyph: `${bike.id}`,
          scale: 1.5,
        })
        const markerOptions = {
          map: map,
          position: {lat: bike.lat, lng: bike.long},
          title: `Bike ID: ${bike.id}<br>Price: <b>${bike.price}/hr</b>`,
          content: pin.element,
          gmpClickable: true,
        };
        const marker = new AdvancedMarkerElement(markerOptions);
        
        // Add a click listener for each marker, and set up the info window.
        marker.addListener("click", ({ domEvent, latLng }) => {
          const { target } = domEvent;
          console.log(target.textContent)
          setId(target.textContent);

          //scroll to the bike listing
          const parentDiv = document.getElementById('availableListings');
          const targetElement = document.getElementById('target-section');
          const targetOffset = targetElement.offsetTop;
          parentDiv.scrollTop = targetOffset;
          // console.log("IM SCROLLING TO THE ITEM")
          

          infoWindow.close();
          infoWindow.setContent(marker.title);
          infoWindow.open(marker.map, marker);
        });
        markers.push(marker);
      });
      //get current Users location and at it to the location

      const userPinStyle = new PinElement({
        background: "#257AFD",
        borderColor: "#137333",
        glyph: "U",
        glyphColor: "White",
        scale: 1,
      });

      getUserLocation()
        .then((userLocation) => {
          // console.log(userLocation); // Output: { latitude: 40.7128, longitude: -74.0060 }
          // Now you can use the userLocation object as needed
          localStorage.setItem('userLocation', JSON.stringify(userLocation)); // Store in local storage
          // Or send it to a server, use it to fetch weather data, etc.
          const userMarkerOptions = {
            map: map,
            position: {lat: userLocation.latitude, lng: userLocation.longitude},
            title: `User's Location`,
            content: userPinStyle.element,
            gmpClickable: true,
          };
          setUserLoc(userLocation);
          const currentLocMarker = new AdvancedMarkerElement(userMarkerOptions);
          markers.push(currentLocMarker);
        })
        .catch((error) => {
          console.error("Error getting location:", error);
        });

      return markers;
    }

    //Helper function to get user location
    function getUserLocation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude,   
     longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(error);   
          }
        );
      });
    }
    
    initMap();
  }, []); // The empty array ensures the effect runs only once, after the initial render

  return (
    <div className="text-black bg-gradient-to-tr from-blue-200 to-white h-full overflow-x-hidden">
      <div id="logo" className="flex pt-7 mb-7 justify-center scale-150">
        <img className="0" src={"/Logo.svg"} alt="Your SVG" /> 
      </div>
      <div id="mainContent"className="h-5/6 flex flex-grow justify-center text-black rounded">
        {/* Map div */}
        <div id="map" className="w-2/3 m-4 border-2 border-black shadow-lg rounded-md">
        </div>

        {/* Info panel div */}
        <div id="listings" className="flex flex-col w-1/3">
          <div className="m-4 min-h-screen border-2 border-black bg-white shadow-lg rounded-md">
            <div className="flex flex-col justify-center">
                <h1 className="flex justify-center text-balance m-2 font-bold">Available Bikes</h1>
              <button type="button" className="m-auto w-11/12 hover:before:bg-blue-500 relative h-[50px] overflow-hidden border border-blue-500 bg-white px-3 text-blue-500 transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-blue-400 before:to-blue-700 before:transition-all before:duration-300 hover:text-white hover:before:left-0 hover:before:w-full"
              >
{/* onClick={handleNewLease} */}
                <span className="relative z-10">New Bike Listing</span>
              </button>
            </div>
            <div id="availableListings" className="h-1/4 flex flex-col m-3 overflow-auto">
              {bikes.available.map((bike, index) => (
                <>
                {/* <hr></hr> */}
                <div id={bike.id == highlightId ?"target-section":""} className={bike.id == highlightId ? "font-bold border-2 border-blue-500 p-2 rounded-lg shadow-xl" : "mt-2 mb-2 border-t-2" } key={index}>
                  <p className="text-lg p-2 mt-2 mb-2">Bike ID: {bike.id}</p>
                  <p className="text-lg p-2 mt-2 mb-2">Price: {bike.price}/hr</p>
                  <p className="text-lg p-2 mt-2 mb-2">Distance From You: {haversineDistance(bike.lat, bike.long, userLoc.latitude, userLoc.longitude).toFixed(2)} miles</p>
                  {bike.id == highlightId ?                  
                    <button type="button" className="w-full text-red hover:before:bg-blue-500 border-blue-500 relative h-[50px] overflow-hidden border border-blue-500 bg-white px-3 text-blue-500 transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-blue-400 before:to-blue-700 before:transition-all before:duration-300 hover:text-white hover:before:left-0 hover:before:w-full"
                    onClick={() => handleRentOut(bike.id)}>
                      {/*  */}
                      <span className="relative z-10">Check out</span>
                        </button>
                    :<></>
                  }
                </div>
                </>
              ))}
            </div>
            <hr></hr>
            {/* <div className="flex flex-col justify-center"> */}
                <h1 className="flex justify-center text-5xl font-bold">Currently Renting</h1>
                <div id="currentlyLeasing" className="h-1/4 flex flex-col m-3 overflow-auto">
                  {bikes.currentlyLeasing.map((bike, index) => (
                  <>
                  {/* <hr></hr> */}
                  <div className="mt-2 mb-2 border-t-2" key={index}>
                    <p className="text-lg mt-2 mb-2">Bike ID: {bike.id}</p>
                    <p className="text-lg mt-2 mb-2">Price: {bike.price}/hr</p>
                    <p className="text-lg mt-2 mb-2">Last known location: {userLoc.latitude}, {userLoc.longitude} </p>
                    <div className="flex flex-col justify-center">
                      <button type="button" className="m-auto w-11/12 hover:before:bg-blue-500 relative h-[50px] overflow-hidden border border-blue-500 bg-white px-3 text-blue-500 transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-blue-400 before:to-blue-700 before:transition-all before:duration-300 hover:text-white hover:before:left-0 hover:before:w-full"
                      onClick={() => handleListRental(bike.id)}>
                        <span className="relative z-10">Return Bike</span>
                      </button>
                    </div>
                    
                  </div>
                  </>
                  ))}
                </div>
            {/* </div> */}


          </div>


        </div>

      </div>

      {isOn && (
        <div className="static">
          <div className="fixed h-screen w-screen bg-black z-10 top-0 opacity-75">
            <button type="button" onClick={setIsOn(false)}>X</button>
            {/* Form here for new bike */}
          </div>
        </div>
      )}

    </div>
  )
}

export default App
