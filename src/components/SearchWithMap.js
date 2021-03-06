import React, { Component, Fragment, createRef } from 'react'
import RestaurantCard from './RestaurantCard'
import OfferCard from './OfferCard'
import Search from './Search'
import MonthlyOffers from './MonthlyOffers'
import { connect } from 'react-redux';
import { Button, Sticky, Item, Card, Image, Sidebar, Menu, Ref, Icon, Segment } from 'semantic-ui-react'
import { Map, GoogleApiWrapper, InfoWrapper, Marker } from 'google-maps-react';
import {GOOGLE_KEY} from '../keys.js'

class SearchWithMap extends Component {

state = {
  visible: false, // sidebar map conditionally renders
  lat: 40.7128, // set map to NYC coordinates by default
  long: -74.0060 // set map to NYC coordinates by default
}

//sets lat and long coordinates of selected restaurant and callbacks to set state to true to show map
viewOnMap = (restaurant) => {
  this.setState({
    lat: restaurant.coordinates.latitude,
    long: restaurant.coordinates.longitude
  }, () => this.makeVisible())
}

makeVisible = () => {
  this.setState({
    visible: true
  })
}

// called in rendered but only displayed if visible is true. 'visible' part of semantic UI.
renderMap = () => {
  const mapStyles = {
    width: '100%',
    height: '100%'
  }

  let iconMarker = new window.google.maps.MarkerImage(
                process.env.PUBLIC_URL + '/foodMarker.png',
                null, /* size is determined at runtime */
                null, /* origin is 0,0 */
                null, /* anchor is bottom center of the scaled image */
                new window.google.maps.Size(50, 50)
              )

  const contextRef = createRef()
  return (
    <Fragment>
    <Item className="closeMap" onClick={()=>this.closeMap()}> Close Map </Item>
    <Map
    google={this.props.google}
    zoom={12}
    style={mapStyles}
    center = {{ lat: this.state.lat, lng: this.state.long }}
    >
    <Marker
      icon={iconMarker}
      position = {{ lat: this.state.lat, lng: this.state.long }}
    />
    </Map>
    </Fragment>
  )
}

// sets state to false to close map
closeMap = () => {
  this.setState({
    visible: false
  })
}


returnDisplay = () => {
  return (
  <div className="pageWrap">
    <Sidebar.Pushable as={Segment} className="mapSideBar">
    <Ref innerRef={this.contextRef}>
      <Sidebar as={Menu}
        animation={'push'}
        direction={'left'}
        icon='labeled'
        inverted
        vertical
        visible={this.state.visible}
        style={{width:'30%'}}>
        <Sticky context={this.contextRef} pushing>
        {this.renderMap()}
        </Sticky>
      </Sidebar>
      </Ref>
    <Sidebar.Pusher>
      <Segment basic>
        <Search viewOnMap={this.viewOnMap}/>
      </Segment>
    </Sidebar.Pusher>
    </Sidebar.Pushable>
  </div>
  )
}

render () {
  return (
    <Fragment>
    {this.returnDisplay()}
    </Fragment>
    )
   }
 }

 export default GoogleApiWrapper({
   apiKey: GOOGLE_KEY
 })(SearchWithMap);
