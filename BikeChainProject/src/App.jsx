import { useState } from 'react'
import { useEffect } from 'react'
// import bike from '../public/bikes.json';//jsonfile with bike data
import './App.css'

function App() {


  useEffect(() => {
    // This function will be called after the component renders
    console.log('Component has rendered!');

    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: "InsertKEY HERES",
      v: "weekly",
      // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
      // Add other bootstrap parameters as needed, using camel case.
    });

    let map;

    async function initMap() {
      const { Map } = await google.maps.importLibrary("maps");

      map = new Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    }

    initMap();
  }, []); // The empty array ensures the effect runs only once, after the initial render

  return (
    <div className="text-black">
      <div id="logo" className="flex size- justify-center">
        <img src={"/bikeChainLogo.svg"} alt="Your SVG" />
      </div>
      <div id="mainContent"className="flex flex-grow justify-center text-black rounded">
        {/* Map div */}
        <div id="map" className="w-2/3 m-4 border-2 border-black shadow-lg rounded-md">
        </div>

        {/* Info panel here */}
        <div className="w-1/3 m-4 border-2 border-black shadow-lg rounded-md">
          <h1 className="flex justify-center font-bold">Available Bikes</h1>
          <div id="availableListings" className="flex flex-col m-3">
            <h2>Bike 1</h2> {/*These will be bikes from a json file*/}
            <h2>Bike 2</h2>
            <h2>Bike 3</h2>
            <h2>Bike 4</h2>

          </div>
        </div>

        
      </div>
    </div>
  )
}

export default App
