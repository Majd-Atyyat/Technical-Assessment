import React from 'react';
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";
import { Descriptions } from 'antd';
import Autocomplete from 'react-google-autocomplete';


Geocode.setApiKey("AIzaSyAKZYjo6ZO94nx48ubNmE_s1laARogyahE")


class Home extends React.Component{
  state = {
    address: '',
    city: '',
    area: '',
    state: '', 
    zoom: 15,
    height: 400,
    mapPosition: {
        lat: 0,
        lng: 0,
    },
    markerPosition: {
        lat: 0,
        lng: 0,
    }
}

componentDidMount() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            
            this.setState({
                mapPosition: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                },
                markerPosition: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
            },
                () => {
                    Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                        response => {
                            console.log(response)
                            const address = response.results[0].formatted_address,
                                addressArray = response.results[0].address_components,
                                city = this.getCity(addressArray),
                                area = this.getArea(addressArray),
                                state = this.getState(addressArray);
                            console.log('city', city, area, state);
                            this.setState({
                                address: (address) ? address : '',
                                area: (area) ? area : '',
                                city: (city) ? city : '',
                                state: (state) ? state : '',
                            });
                        },
                        error => {
                            console.error(error);
                        }
                    );

                })
        });
    } else {
        console.error("Geolocation is not supported by this browser!");
    }
};


// functions to get specific city , area , and state.
getCity = (addressArray) => {
    let city = '';
    for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
            city = addressArray[i].long_name;
            return city;
        }
    }
};

getArea = (addressArray) => {
    let area = '';
    for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0]) {
            for (let j = 0; j < addressArray[i].types.length; j++) {
                if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                    area = addressArray[i].long_name;
                    return area;
                }
            }
        }
    }
};

getState = (addressArray) => {
    let state = '';
    for (let i = 0; i < addressArray.length; i++) {
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                state = addressArray[i].long_name;
                return state;
            }
        }
    }
};

onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
};

onInfoWindowClose = (event) => { };

// function to get the new let and lng values for onDragEnd
onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
        newLng = event.latLng.lng();
        console.log('newLat',newLat);
//to know the adress and city etc from the len and lng using geocode
    Geocode.fromLatLng(newLat, newLng).then(
        response => {
            console.log('response',response)
            // to put data into the state
            const address = response.results[0].formatted_address,
                addressArray = response.results[0].address_components,
                city = this.getCity(addressArray),
                area = this.getArea(addressArray),
                state = this.getState(addressArray);
            this.setState({
                address: (address) ? address : '',
                area: (area) ? area : '',
                city: (city) ? city : '',
                state: (state) ? state : '',
                markerPosition: {
                    lat: newLat,
                    lng: newLng
                },
                mapPosition: {
                    lat: newLat,
                    lng: newLng
                },
            })
        },
        error => {
            console.error(error);
        }
    );
};

onPlaceSelected = (place) => {
    console.log('plc', place);
    const address = place.formatted_address,
        addressArray = place.address_components,
        city = this.getCity(addressArray),
        area = this.getArea(addressArray),
        state = this.getState(addressArray),
        latValue = place.geometry.location.lat(),
        lngValue = place.geometry.location.lng();

    console.log('latvalue', latValue)
    console.log('lngValue', lngValue)

    // Set these values in the state.
    this.setState({
        address: (address) ? address : '',
        area: (area) ? area : '',
        city: (city) ? city : '',
        state: (state) ? state : '',
        markerPosition: {
            lat: latValue,
            lng: lngValue
        },
        mapPosition: {
            lat: latValue,
            lng: lngValue
        },
    })
};


// in order to coorectly load google maps js api we need tp wrap it with with scripts js HOC
// in order to initilize the mymap component with DOM we need to wrap it with with googlemap HOC
render() {
    const MapWithAMarker = withScriptjs(
        withGoogleMap(
            props => (
               
                <GoogleMap
                    defaultZoom={this.state.zoom}
                    defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
                >
                    {/*  */}
 

                    {/*Marker*/}
                    <Marker
                        google={this.props.google}
                        name={'Dolores park'}
                        draggable={true}
                        onDragEnd={this.onMarkerDragEnd}
                        position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                    />
                    <InfoWindow
                        onClose={this.onInfoWindowClose}
                        position={{ lat: (this.state.markerPosition.lat + 0.0018), lng: this.state.markerPosition.lng }}
                    >
                        <div>
                            <span style={{ padding: 0, margin: 0 }}>{this.state.address}</span>
                        </div>
                    </InfoWindow>
                    <Marker />

                  


                    {/* For Auto complete Search Box */}
                    <Autocomplete
                        style={{
                            width: '100%',
                            height: '40px',
                            paddingLeft: '16px',
                            marginTop: '2px',
                            marginBottom: '2rem'
                        }}
                        onPlaceSelected={this.onPlaceSelected}
                        types={['(regions)']}
                    />
                </GoogleMap>
            )
        )
    );


    return (
        // {}
      <div style={{ padding: '1rem', margin: '0 auto', maxWidth: 1000 }}>

            {
            <span>
                   <h1>Google Map</h1>
            <Descriptions bordered>
                <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
                <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
                <Descriptions.Item label="State">{this.state.state}</Descriptions.Item>
                <Descriptions.Item label="Address">{this.state.address}</Descriptions.Item>
            </Descriptions>
            
            <MapWithAMarker
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAKZYjo6ZO94nx48ubNmE_s1laARogyahE&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            />
            </span>
            }
         
     </div>
      );
  }
  
}


export default Home;
